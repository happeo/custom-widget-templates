const fetch = require("node-fetch");
const {
  OAUTH_CALLBACK_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SCOPES,
  BASE_URL,
} = require("../constants");

const exchangeCodeToToken = (code) => {
  const url = new URL(`${BASE_URL}/oauth/tokens`);
  const params = {
    code,
    redirect_uri: OAUTH_CALLBACK_URL,
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: SCOPES,
  };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data);
      }
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

const fetchTickets = async (accessToken) => {
  const url = new URL(`${BASE_URL}/api/v2/tickets.json`);
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const tickets = await fetch(url, options);
  return await tickets.json();
};

const createNewTicket = async (accessToken, input) => {
  const url = new URL(`${BASE_URL}/api/v2/tickets.json`);
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  };

  const newTicket = await fetch(url, options);
  return newTicket.json();
};

const fetchUserById = async (id, accessToken) => {
  const url = new URL(`${BASE_URL}/api/v2/users/${id}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const user = await fetch(url, options);
  return await user.json();
};

const fetchArticles = async (articleId, accessToken, locale = 'en-us') => {
  const localeString = locale ? `/${locale}` : '';
  const url = new URL(`${BASE_URL}/api/v2/help_center${localeString}/articles/${articleId}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const articleList = await fetch(url, options);
  return await articleList.json();
};

// TODO We have to handle locale based on document's language
// each request should be sent with locale value like "en-us"
const fetchCategories = async (page = 1, accessToken) => {
  const pageNumber = Number.parseInt(page, 10);
  const searchParams = new URLSearchParams({ sort_by: 'position', position: pageNumber });
  const url = new URL(`${BASE_URL}/api/v2/help_center/en-us/categories?${searchParams}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const categories = await fetch(url, options);
  return await categories;
};

const fetchSections = async (categoryId, page = 1, accessToken) => {
  const pageNumber = Number.parseInt(page, 10);
  const searchParams = new URLSearchParams({ sort_by: 'position', position: pageNumber });
  const url = new URL(`${BASE_URL}/api/v2/help_center/categories/${categoryId}/sections?${searchParams}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const sections = await fetch(url, options);
  return await sections;
};

const fetchSectionArticles = async (sectionId, page = 1, accessToken) => {
  const pageNumber = Number.parseInt(page, 10);
  const searchParams = new URLSearchParams({ sort_by: 'position', position: pageNumber });
  const url = new URL(`${BASE_URL}/api/v2/help_center/sections/${sectionId}/articles?${searchParams}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const articles = await fetch(url, options);
  return await articles;
};

const fetchSearch = async (query, accessToken, locale = 'en-us') => {
  const searchParams = new URLSearchParams({ query, 'filter[locales]': locale, result_type: 'article' });
  const url = new URL(`${BASE_URL}/api/v2/help_center/articles/search?${searchParams}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const articles = await fetch(url, options);
  return await articles;
};

module.exports = {
  exchangeCodeToToken,
  fetchTickets,
  createNewTicket,
  fetchUserById,
  fetchArticles,
  fetchCategories,
  fetchSections,
  fetchSectionArticles,
  fetchSearch,
};
