import { Locals } from "models/auth";
import { User } from "models/user";

const MEMORY_CACHE: { [key: string]: Locals | null } = {};

const getCacheKey = (user: User, origin = "") =>
  `${user.id}_${Buffer.from(origin).toString("base64")}`;

const setAuthToCache = (data: Locals) => {
  return (MEMORY_CACHE[getCacheKey(data.user, data.origin)] = data);
};

const getAuthFromCache = (user: User, origin: string) =>
  MEMORY_CACHE[getCacheKey(user, origin)];

const clearAuthFromCache = (user: User, origin: string) =>
  (MEMORY_CACHE[getCacheKey(user, origin)] = null);

export { setAuthToCache, getAuthFromCache, clearAuthFromCache };
