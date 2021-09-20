import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import oauthBegin from "./controllers/oauthBegin";
import asyncwrapper from "./middlewares/asyncwrapper";
import { verifyJiraAuth } from "./middlewares/jiraAuth";
import oauthCallback from "./controllers/oauthCallback";
import { accessibleResources, search, suggestions } from "./controllers/jira";
import { verifyHappeoAuth } from "./middlewares/happeoAuth";
import { initKeyRing } from "./services/kms";
import { initAtlassian } from "./services/atlassian";
import { initJWT } from "./services/jwt";
import projectSelector from "./controllers/projectSelector";

Promise.all([initKeyRing(), initAtlassian(), initJWT()]).then(() => {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.set("view engine", "pug");

  app.get("/oauth/begin", asyncwrapper(oauthBegin));

  app.get("/oauth/callback", asyncwrapper(oauthCallback));

  app.get("/project-selector", asyncwrapper(projectSelector));

  app.get(
    "/api/accessible-resources",
    verifyHappeoAuth,
    verifyJiraAuth,
    asyncwrapper(accessibleResources),
  );

  app.get(
    "/api/search",
    verifyHappeoAuth,
    verifyJiraAuth,
    asyncwrapper(search),
  );

  app.get(
    "/api/suggestions",
    verifyHappeoAuth,
    verifyJiraAuth,
    asyncwrapper(suggestions),
  );

  app.use(function (_req, res, next) {
    res.set("Cache-control", "no-cache");
    next();
  });

  // Serve any static files
  app.use("/public", express.static(path.join(__dirname, "public")));

  app.get("/oauth/result", function (req, res) {
    const { success } = req.query;
    if (success === "true") {
      res.sendFile(path.join(__dirname, "./public/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "./public/error.html"));
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).send(err.message);
  });

  const port = process.env.PORT || 8081;
  app.listen(port, () => {
    console.log(`Custom widget example: listening on port ${port}`);
  });
});
