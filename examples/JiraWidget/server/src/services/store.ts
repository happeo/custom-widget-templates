import { Locals } from "models/auth";
import { User } from "models/user";

const { encryptToken, decryptToken } = require("./encryption");
const { saveAuth, getAuth } = require("./firestore");
import { getAuthFromCache, setAuthToCache } from "./memoryCache";

const storeToken = async (
  user: User,
  origin: string,
  token: string,
  initialSave: boolean,
) => {
  const encryptedToken = await encryptToken(user, token);
  await saveAuth(user, origin, encryptedToken, initialSave);
};

/**
 *
 * @param {Object} Local user object
 * @param {String} Origin of request
 * @returns {Object} token<object<access_token<string>, refresh_token<string>>, origin<string>, projectId<string>, projectBaseUrl<string>, initialSave<bool>
 */
const getToken = async (user: User, incomingOrigin: string) => {
  const now = Date.now();
  const cachedToken = getAuthFromCache(user, incomingOrigin);
  if (cachedToken) {
    console.log(`Getting auth from cache took: ${Date.now() - now}ms`);
    return cachedToken;
  }

  const { auth, origin, projectId, projectBaseUrl, initialSave } =
    await getAuth(user, incomingOrigin);

  console.log(`Getting auth took: ${Date.now() - now}ms`);

  const decryptNow = Date.now();
  const token = await decryptToken(user, auth);

  console.log(
    `Decrypting auth took: ${Date.now() - decryptNow}ms. Total ${
      Date.now() - now
    }ms.`,
  );

  const response: Locals = {
    origin,
    auth: token,
    projectId,
    projectBaseUrl,
    initialSave,
    user,
  };

  if (!initialSave) {
    console.log("Saving auth to local memory.");
    setAuthToCache(response);
  }

  return response;
};

export { storeToken, getToken };
