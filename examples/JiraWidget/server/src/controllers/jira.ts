import { Request, Response, NextFunction } from "express";
import { InternalServerError, Unauthorized } from "http-errors";
import { Locals } from "models/auth";
import { JiraIssue } from "models/external/jiraIssue";
import { Issue } from "models/issue";
import {
  getAccessibleResources,
  searchWithJql,
  searchSuggestions,
  getStatuses,
} from "../services/atlassian";

const getIssueStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;
    const items = await getStatuses(res.locals.auth, query);
    res.send({ items });
  } catch (error) {
    next(error);
  }
};

const accessibleResources = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await getAccessibleResources(res.locals as Locals);
    res.send({ items });
  } catch (error) {
    next(error);
  }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req;

    const response = await searchWithJql(res.locals as Locals, query);
    res.send({
      ...response,
      _project: {
        projectId: res.locals.projectId,
        projectBaseUrl: res.locals.projectBaseUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const suggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req;
    const response = await searchSuggestions(res.locals as Locals, query);

    if (response.code === 401) throw new Unauthorized();
    if (response.code !== 200) throw new InternalServerError();

    let issueList: JiraIssue[] = [];
    response.data.sections.forEach(({ issues }) => {
      issueList = [...issueList, ...issues];
    });

    const formattedList: Issue[] = issueList.map((issue) => ({
      id: issue.id,
      url: `${res.locals.projectBaseUrl}/browse/${issue.key}`,
      text: issue.summaryText,
      highlightedText: issue.summary,
      icon: `${res.locals.projectBaseUrl}${issue.img}`,
      subtitle: issue.key,
    }));

    res.send({
      items: formattedList,
      _raw: response.data,
      _project: {
        projectId: res.locals.projectId,
        projectBaseUrl: res.locals.projectBaseUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getIssueStatuses, accessibleResources, search, suggestions };
