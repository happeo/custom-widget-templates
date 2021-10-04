import { Locals } from "models/auth";
import { User } from "models/user";

const FILTER_CACHE_EXPIRES = 60000;
const MEMORY_CACHE: { [key: string]: Locals | null } = {};

const FILTER_CACHE: { [key: string]: any | null } = {};

const getCacheKey = (user: User, origin = "") =>
  `${user.id}_${Buffer.from(origin).toString("base64")}`;

const setAuthToCache = (data: Locals) => {
  return (MEMORY_CACHE[getCacheKey(data.user, data.origin)] = data);
};

const getAuthFromCache = (user: User, origin: string) =>
  MEMORY_CACHE[getCacheKey(user, origin)];

const clearAuthFromCache = (user: User, origin: string) =>
  (MEMORY_CACHE[getCacheKey(user, origin)] = null);

const getProjectFiltersFromCache = (projectId: string, filterName: string) => {
  const projectKey = FILTER_CACHE[projectId];
  const cached = projectKey && projectKey[filterName];
  if (!cached || cached.expires < Date.now()) return null;

  return cached.data;
};

interface SaveProjectFilter {
  projectId: string;
  key: string;
  data: any;
}

const saveProjectFiltersToCache = (params: SaveProjectFilter) => {
  if (!FILTER_CACHE[params.projectId]) {
    FILTER_CACHE[params.projectId] = {
      [params.key]: {
        data: params.data,
        expires: Date.now() + FILTER_CACHE_EXPIRES,
      },
    };
  } else {
    FILTER_CACHE[params.projectId][params.key] = {
      data: params.data,
      expires: Date.now() + FILTER_CACHE_EXPIRES,
    };
  }
};

export {
  setAuthToCache,
  getAuthFromCache,
  clearAuthFromCache,
  saveProjectFiltersToCache,
  getProjectFiltersFromCache,
};
