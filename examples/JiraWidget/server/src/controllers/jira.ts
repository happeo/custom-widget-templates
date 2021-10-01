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
  getIssueTypes,
  getLabels,
  getPriorities,
} from "../services/atlassian";

const createIssueTypeFilters = (
  data: { name: string; scope: Object; id: string }[],
) => {
  const issueTypeFilter = {
    key: "issueType",
    label: "Issue Type",
    type: "checkbox",
    options: data
      .filter((issue) => issue.scope !== undefined)
      .map((issue) => {
        return { key: issue.id, name: issue.name };
      }),
  };

  return issueTypeFilter;
};

const createIssueStatusFilters = (data: { name: string; id: string }[]) => {
  const issueStatusFilter = {
    key: "issueStatus",
    label: "Issue Status",
    type: "checkbox",
    options: data.map((status) => {
      return { key: status.id, name: status.name };
    }),
  };
  return issueStatusFilter;
};

const createIssueLabelFilters = (data: { values: string[] }) => {
  const issueLabelFilter = {
    key: "issueLabel",
    label: "Issue Label",
    type: "checkbox",
    options: data.values.map((label, i) => {
      return { key: `${i}`, name: label };
    }),
  };
  return issueLabelFilter;
};

const createIssuePriorities = (data: { name: string; id: string }[]) => {
  const issueLabelFilter = {
    key: "issuePriority",
    label: "Issue Priority",
    type: "checkbox",
    options: data.map((priority) => {
      return { key: priority.id, name: priority.name };
    }),
  };
  return issueLabelFilter;
};

const getIssueStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;
    const items = await getStatuses(res.locals as Locals, query);
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

    const [response, items, issueTypes, labels, priorities] = await Promise.all(
      [
        searchWithJql(res.locals as Locals, query),
        getStatuses(res.locals as Locals, query),
        getIssueTypes(res.locals as Locals, query),
        getLabels(res.locals as Locals, query),
        getPriorities(res.locals as Locals, query),
      ],
    );

    const pageInfo: PageInfo = {
      pageNumber: response.startAt / response.maxResults,
      pageSize: response.maxResults,
      total: response.total,
    };

    const jiraIssues: JiraIssue[] = response.issues || [];

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
      filters: [
        createIssueStatusFilters(items),
        createIssueTypeFilters(issueTypes),
        createIssueLabelFilters(labels),
        createIssuePriorities(priorities),
      ],
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
