import { BASE_URL } from "./constants";
import { get } from "./utils";

export const getAccessibleResources = async (token) => {
  const { items } = await get(`${BASE_URL}/api/accessible-resources`, {
    token,
  });
  return items;
};

export const searchIssues = async (token, params) => {
  const result = await get(`${BASE_URL}/api/search`, {
    params,
    token,
  });

  if (result.errors || result.errorMessages) {
    throw new Error(result.errorMessages);
  }

  return result;
};

export const suggestIssues = async (token, params) => {
  const result = await get(`${BASE_URL}/api/suggestions`, {
    params,
    token,
  });

  if (result.errors || result.errorMessages) {
    throw new Error(result.errorMessages);
  }

  return result;
};
