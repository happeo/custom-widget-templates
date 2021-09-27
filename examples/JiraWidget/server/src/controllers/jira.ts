import { Request, Response, NextFunction } from "express";
import { InternalServerError, Unauthorized } from "http-errors";
import { Locals } from "models/auth";
import { JiraIssue } from "models/external/jiraIssue";
import { PageInfo } from "models/pageInfo";
import { UnifiedResponse } from "models/unifiedResponses";
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

    const pageInfo: PageInfo = {
      pageNumber: response.startAt / response.maxResults,
      pageSize: response.maxResults,
      total: response.total,
    };
    const jiraIssues: JiraIssue[] = response.issues;

    const formattedResponse: UnifiedResponse[] = jiraIssues.map((issue) => {
      return {
        value: issue.key,
        description: issue.fields.summary,
        id: `${issue.id}`,
        icon: issue.fields.issuetype?.iconUrl,
        url: `${res.locals.projectBaseUrl}/browse/${issue.key}`,
      };
    });

    res.send({
      ...pageInfo,
      items: formattedResponse,
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

    const formattedList: UnifiedResponse[] = issueList.map((issue) => ({
      id: `${issue.id}`,
      url: `${res.locals.projectBaseUrl}/browse/${issue.key}`,
      description: issue.summaryText,
      icon: `${res.locals.projectBaseUrl}${issue.img}`,
      value: issue.key,
    }));

    res.send({
      items: formattedList,
    });
  } catch (error) {
    next(error);
  }
};

export { getIssueStatuses, accessibleResources, search, suggestions };
