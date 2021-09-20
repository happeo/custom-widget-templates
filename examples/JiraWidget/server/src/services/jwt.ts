import jwt from "jsonwebtoken";
import { SHARED_SECRET_KEY } from "../constants";
import { createStateToken } from "./firestore";
import { getSecret } from "./secretManager";

let sharedSecret: string;

function createInternalToken(data: any) {
  return jwt.sign(data, sharedSecret, { expiresIn: "2min" });
}

function verifySharedToken(token: string) {
  try {
    const data: any = jwt.verify(token, sharedSecret);
    if (data.id) {
      return data;
    }

    return {
      id: data.user.id,
      organisationId: data.organisation.id,
    };
  } catch (error) {
    throw error;
  }
}

function generateStateToken(token: string, origin: string) {
  try {
    return createStateToken({
      token,
      origin,
    });
  } catch (error) {
    throw error;
  }
}

const initJWT = async () => {
  try {
    sharedSecret = (await getSecret(SHARED_SECRET_KEY)) as string;
    console.log("[JWT] Shared secret ready");
  } catch (error) {
    throw error;
  }
};

export { createInternalToken, verifySharedToken, generateStateToken, initJWT };
