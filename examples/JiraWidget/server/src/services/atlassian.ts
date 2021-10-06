import { Locals } from "models/auth";
import { JiraAccessibleResource } from "models/external/jiraAccessibleResource";
import { JiraSuggestionIssueResponse } from "models/external/jiraSuggestionResponse";
import { AuthToken } from "models/token";
import {
  getProjectFiltersFromCache,
  saveProjectFiltersToCache,
} from "./memoryCache";
const {
  Unauthorized,
  BadRequest,
  TooManyRequests,
  InternalServerError,
} = require("http-errors");
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

const handleJiraErrors = (code: number) => {
  switch (code) {
    case 401:
      throw new Unauthorized();
    case 429:
      throw new TooManyRequests();

    default:
      throw new InternalServerError();
  }
};

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
  } catch (error: any) {
    throw new Unauthorized(error.message);
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

  const cache = getProjectFiltersFromCache(locals.projectId, "statuses");
  if (cache) return cache;

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
    return await getStatuses(newLocals, params);
  }

  if (response.status !== 200) handleJiraErrors(response.status);

  saveProjectFiltersToCache({
    projectId: locals.projectId,
    key: "statuses",
    data: result,
  });

  return result;
};

const getLabels = async (locals: Locals, params = {} as any) => {
  if (!params.resourceId && !locals.projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const cache = getProjectFiltersFromCache(locals.projectId, "labels");
  if (cache) return cache;

  const url = new URL(
    `${BASE_URL}/ex/jira/${
      params.resourceId || locals.projectId
    }/rest/api/3/label?maxResults=10000`,
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
    return await getLabels(newLocals, params);
  }

  if (response.status !== 200) handleJiraErrors(response.status);

  saveProjectFiltersToCache({
    projectId: locals.projectId,
    key: "labels",
    data: result,
  });

  return result;
};

const getPriorities = async (locals: Locals, params = {} as any) => {
  if (!params.resourceId && !locals.projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const cache = getProjectFiltersFromCache(locals.projectId, "priorities");
  if (cache) return cache;

  const url = new URL(
    `${BASE_URL}/ex/jira/${
      params.resourceId || locals.projectId
    }/rest/api/3/priority`,
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
    return await getPriorities(newLocals, params);
  }

  if (response.status !== 200) handleJiraErrors(response.status);

  saveProjectFiltersToCache({
    projectId: locals.projectId,
    key: "priorities",
    data: result,
  });

  return result;
};

const getIssueTypes = async (locals: Locals, params = {} as any) => {
  if (!params.resourceId && !locals.projectId) {
    throw new BadRequest(
      "missing_parameter: 'resourceId' or prop.projectId not set",
    );
  }

  const cache = getProjectFiltersFromCache(locals.projectId, "issueTypes");
  if (cache) return cache;

  const url = new URL(
    `${BASE_URL}/ex/jira/${
      params.resourceId || locals.projectId
    }/rest/api/3/issuetype`,
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
    return await getIssueTypes(newLocals, params);
  }

  if (response.status !== 200) handleJiraErrors(response.status);

  saveProjectFiltersToCache({
    projectId: locals.projectId,
    key: "issueTypes",
    data: result,
  });

  return result;
};

const searchSuggestions = async (
  locals: Locals,
  params: any,
): Promise<{ sections: JiraSuggestionIssueResponse[] }> => {
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
    return await searchSuggestions(newLocals, params);
  }

  if (response.status !== 200) handleJiraErrors(response.status);

  return result;
};

interface SearchInput {
  query: string;
  issueType: string | string[];
  issueStatus?: string | [];
  issueAssignee?: string | [];
  issueCreator?: string | [];
  issuePriority?: string | [];
  issueLabel?: string | [];
  pageSize?: string;
  pageNumber?: string;
}

const buildJqlQueryCondition = (field: string, value: string | string[]) => {
  return Array.isArray(value)
    ? `${field} IN (${value.map((t) => `"${t}"`).join(",")})`
    : `${field}= "${value}"`;
};

const createJqlQuery = (params: SearchInput) => {
  let jql = "";

  if (params.query) jql += `text~ "${params.query.trim()}*"`;

  if (params.issueType) {
    if (jql.length > 0) jql += " AND ";
    jql += buildJqlQueryCondition("issueType", params.issueType);
  }

  if (params.issueStatus) {
    if (jql.length > 0) jql += " AND ";
    jql += buildJqlQueryCondition("status", params.issueStatus);
  }

  if (params.issueLabel) {
    if (jql.length > 0) jql += " AND ";
    jql += buildJqlQueryCondition("labels", params.issueLabel);
  }

  if (params.issuePriority) {
    if (jql.length > 0) jql += " AND ";
    jql += buildJqlQueryCondition("priority", params.issuePriority);
  }
  return jql;
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

  url.searchParams.append("jql", createJqlQuery(params));
  url.searchParams.append("maxResults", params.pageSize || 10);
  url.searchParams.append(
    "startAt",
    params.pageNumber && params.pageSize
      ? `${params.pageNumber * params.pageSize}`
      : "0",
  );
  url.searchParams.append("fields", "summary,issuetype");

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

  if (response.status !== 200) handleJiraErrors(response.status);

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
  getIssueTypes,
  getLabels,
  getPriorities,
};
