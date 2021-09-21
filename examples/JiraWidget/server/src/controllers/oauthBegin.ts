import { BadRequest } from "http-errors";
import { Request, Response } from "express";
import {
  CLIENT_ID,
  OAUTH_CALLBACK_URL,
  SCOPES,
  AUTH_BASE_URL,
} from "../constants";
import { createStateToken } from "../services/firestore";
import { verifySharedToken, createInternalToken } from "../services/jwt";

/**
 * Callback of Jira OAuth process. Drawbridge does not authenticate the user because of custom domains.
 * So we use JWT token from query parameters instead for authentication
 *
 * @param {*} req
 * @param {*} res
 */
export default async function oauthBegin(req: Request, res: Response) {
  const { token, origin } = req.query;

  if (!token) {
    throw new BadRequest("token_missing");
  }

  if (!origin) {
    throw new BadRequest("origin_missing");
  }

  // Verify token gotten from Happeo
  const user = verifySharedToken(token as string);

  // Create new token that is valid for only 2 mins
  const newToken = createInternalToken(user);

  const stateToken = await createStateToken({
    token: newToken,
    origin: origin as string,
  });

  const authorize = new URL(`${AUTH_BASE_URL}/authorize`);
  authorize.searchParams.append("audience", "api.atlassian.com");
  authorize.searchParams.append("client_id", CLIENT_ID);
  authorize.searchParams.append("scope", SCOPES);
  authorize.searchParams.append("redirect_uri", OAUTH_CALLBACK_URL);
  authorize.searchParams.append("state", stateToken);
  authorize.searchParams.append("response_type", "code");
  authorize.searchParams.append("prompt", "consent");

  res.redirect(authorize.href);
}
