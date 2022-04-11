import { get } from "./utils";

export const getTickets = async (token) => {
  const { tickets } = await get(`${process.env.API_URL}/tickets`, { token });
  return tickets;
};

export const submitTicket = async (token, ticket) => {
  const { tickets } = await get(`${process.env.API_URL}/tickets`, {
    body: ticket,
    token,
  });
  return tickets;
};

export const getArticle = async (id, token) => {
  const idString = id ? `/${id}` : '';
  const { article = {} } = await get(`${process.env.API_URL}/articles${idString}`, {
    token,
  });
  return article;
};

export const getSectionArticles = async (token, page, id) => {
  const query = new URLSearchParams({ page });
  const articles = await get(`${process.env.API_URL}/sections/${id}/articles?${query}`, {
    token,
  });
  return articles;
};

export const getCategories = async (token, page) => {
  const query = new URLSearchParams({ page });
  const categories = await get(`${process.env.API_URL}/categories?${query}`, {
    token,
  });
  return categories;
};

export const getCategorySections = async (token, page, id) => {
  const query = new URLSearchParams({ page });
  const sections = await get(`${process.env.API_URL}/categories/${id}/sections?${query}`, {
    token,
  });
  return sections;
};

export const getSearch = async (token, query) => {
  const search = new URLSearchParams({ search: query });
  const searchResult = await get(`${process.env.API_URL}/search?${search}`, {
    token,
  });
  return searchResult;
};
