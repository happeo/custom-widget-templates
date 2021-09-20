import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "http-errors";
import { verifySharedToken } from "../services/jwt";

const verifyHappeoAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw new Unauthorized();
    const token = authorization.split("Bearer ")[1];
    const user = verifySharedToken(token);

    console.log(
      `Request for userId:${user.id} organisationId:${user.organisationId}`,
    );

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyHappeoAuth };
