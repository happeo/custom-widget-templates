import { Request, Response, NextFunction } from "express";
const { Unauthorized } = require("http-errors");
const { getToken } = require("../services/store");

const verifyJiraAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { origin } = req.headers;
    const { user } = res.locals;

    if (!origin) {
      throw new Unauthorized("invalid_xrfs");
    }

    const {
      origin: savedOrigin,
      auth,
      projectId,
      projectBaseUrl,
      initialSave,
    } = await getToken(user, origin);

    if (!origin || !auth) {
      throw new Unauthorized("authorization_missing");
    }

    if (savedOrigin !== origin) {
      throw new Unauthorized("invalid_xrfs");
    }

    const { access_token, refresh_token } = auth || {};

    if (!access_token && !refresh_token) {
      throw new Unauthorized("authorization_missing");
    }

    if (initialSave) {
      throw new Unauthorized("project_not_selected");
    }

    res.locals.auth = {
      access_token,
      refresh_token,
    };
    res.locals.origin = origin;
    res.locals.projectId = projectId;
    res.locals.projectBaseUrl = projectBaseUrl;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyJiraAuth };
