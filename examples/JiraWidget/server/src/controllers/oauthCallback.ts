import { Request, Response } from "express";
import { User } from "models/user";
import { verifySharedToken } from "../services/jwt";
import { exchangeCodeToToken } from "../services/atlassian";
import { storeToken } from "../services/store";
import { getStateTokenById } from "../services/firestore";

/**
 * Callback of Zendesk OAuth process.
 *
 * @param {*} req
 * @param {*} res
 */
export default async function oauthCallback(req: Request, res: Response) {
  const { code, state, error } = req.query;
  const { token, origin } = await getStateTokenById(state as string);
  const user: User = verifySharedToken(token);

  try {
    if (error) {
      res.status(400);
      return;
    }

    const authToken = await exchangeCodeToToken(code as string);

    // Store token to storage as encrypted string
    // Encryption key is generated per user
    // storeToken with initialSave set to true
    await storeToken(user, origin, authToken, true);

    console.log(`/project-selector?token=${token}&origin=${origin}`);
    res.redirect(`/project-selector?token=${token}&origin=${origin}`);
  } catch (err) {
    console.log(err);
    res.status(200).render("setup-failed");
  }
}
