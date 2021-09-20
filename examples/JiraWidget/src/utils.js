import { filterXSS } from "xss";

export const get = (url, { body, params, token, ...customConfig } = {}) => {
  const resourceUrl = new URL(url);
  const headers = { "Content-Type": "application/json" };
  const config = {
    method: "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  };
  if (params) {
    Object.keys(params).forEach((key) =>
      resourceUrl.searchParams.append(key, params[key]),
    );
  }
  if (body) {
    config.body = JSON.stringify(body);
  }

  return window.fetch(resourceUrl, config).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else {
      let message = await response.text();
      if (response.status === 401) {
        message = "unauthorized";
      }
      return Promise.reject(new Error(message));
    }
  });
};

export const toSafeText = (html = "") => {
  return filterXSS(html, {
    whiteList: { b: [] }, // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
    // to filter out its content
  });
};
