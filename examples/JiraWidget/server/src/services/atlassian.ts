import { Locals } from "models/auth";
import { JiraAccessibleResource } from "models/external/jiraAccessibleResource";
import { JiraSuggestionIssueResponse } from "models/external/jiraSuggestionResponse";
import { AuthToken } from "models/token";
const { Unauthorized, BadRequest } = require("http-errors");
const fetch = require("node-fetch");
const {
  OAUTH_CALLBACK_URL,
  CLIENT_ID,
  BASE_URL,
  AUTH_BASE_URL,
  CLIENT_SECRET_KEY,
} = require("../constants");
const { storeToken } = require("./store");
const { getSecret } = require("./secretManager");
const { clearAuthFromCache } = require("./memoryCache");

let secrets = {
  client_id: CLIENT_ID,
  client_secret: null,
};

interface JiraResponse<T> {
  code: number;
  data: T;
}

const exchangeCodeToToken = (code: string): Promise<AuthToken> => {
  const body = {
    code,
    grant_type: "authorization_code",
    redirect_uri: OAUTH_CALLBACK_URL,
    ...secrets,
  };
  return fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res: any) => res.json())
    .then((data: any) => {
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }
      return data;
    })
    .catch((error: any) => {
      throw error;
    });
};

const getNewToken = async (locals: Locals) => {
  const body = {
    grant_type: "refresh_token",
    refresh_token: locals.auth.refresh_token,
    ...secrets,
  };
  return fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res: any) => res.json())
    .then((data: any) => {
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }
      return data;
    })
    .catch((error: any) => {
      throw error;
    });
};

const useRefreshToken = async (locals: Locals) => {
  console.log(`[Atlassian] Clearing tokeng from local cache ${locals.user.id}`);
  clearAuthFromCache(locals.user, locals.origin);

  if (locals.refreshed) {
    throw new Unauthorized("retry_limit_exceeded");
  }

  try {
    console.log(
      `[Atlassian] Getting latest token from storage ${locals.user.id}`,
    );

    console.log(`[Atlassian] Refreshing token ${locals.user.id}`);

    const token = await getNewToken(locals);
    await storeToken(locals.user, locals.origin, token, false);

    return {
      ...locals,
      auth: token,
      refreshed: true,
    };
  } catch (error) {
    console.error(`Unable to refresh token: ${error.message}`);
    if (error.message === "invalid_grant") {
      throw new Unauthorized(error.message);
    }
    throw error;
  }
};

const getAccessibleResources = async (
  locals: Locals,
): Promise<JiraResponse<JiraAccessibleResource[]>> => {
  const { auth } = locals;

  const url = new URL(`${BASE_URL}/oauth/token/accessible-resources`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      Accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const { status } = response;
  const result: JiraAccessibleResource[] = await response.json();

  if (status === 401 && auth.refresh_token) {
    const newLocals = await useRefreshToken(locals);
    return await getAccessibleResources(newLocals);
  }

  return { code: status, data: result };
};

const getStatuses = async (locals: Locals, params = {} as any) => {
  if (!params.resourceId && !locals.projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const url = new URL(
    `${BASE_URL}/ex/jira/${
      params.resourceId || locals.projectId
    }/rest/api/3/status`,
  );

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${locals.auth.access_token}`,
      Accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const result = await response.json();

  if (result.code === 401 && locals.auth.refresh_token) {
    const newLocals = await useRefreshToken(locals);
    return await searchWithJql(newLocals, params);
  }

  return result;
};

const searchSuggestions = async (
  locals: Locals,
  params: any,
): Promise<JiraResponse<{ sections: JiraSuggestionIssueResponse[] }>> => {
  const { auth, projectId = {} } = locals;

  if (!params.resourceId && !projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const url = new URL(
    `${BASE_URL}/ex/jira/${
      params.resourceId || projectId
    }/rest/api/3/issue/picker`,
  );

  url.searchParams.append("query", params.query || "");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      Accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const { status } = response;
  const result = await response.json();

  if (result.code === 401 && locals.auth.refresh_token) {
    const newLocals = await useRefreshToken(locals);
    return await searchWithJql(newLocals, params);
  }

  return { code: status, data: result };
};

const searchWithJql = async (locals: Locals, params: any): Promise<any> => {
  const { auth, projectId } = locals;

  if (!params.resourceId && !projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const url = new URL(
    `${BASE_URL}/ex/jira/${params.resourceId || projectId}/rest/api/3/search`,
  );

  url.searchParams.append("jql", params.query ? `text~ "${params.query}"` : "");
  url.searchParams.append("maxResults", params.pageSize || 10);
  url.searchParams.append(
    "startAt",
    params.pageNumber && params.pageSize
      ? `${params.pageNumber * params.pageSize}`
      : "0",
  );

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      Accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const result = await response.json();

  if (result.code === 401 && locals.auth.refresh_token) {
    const newLocals = await useRefreshToken(locals);
    return await searchWithJql(newLocals, params);
  }

  return result;
};

const initAtlassian = async () => {
  try {
    const clientSecret = await getSecret(CLIENT_SECRET_KEY);
    secrets.client_secret = clientSecret;
    console.log("[Atlassian] api keys ready");
  } catch (error) {
    throw error;
  }
};

export {
  initAtlassian,
  exchangeCodeToToken,
  getAccessibleResources,
  searchWithJql,
  searchSuggestions,
  getStatuses,
};
