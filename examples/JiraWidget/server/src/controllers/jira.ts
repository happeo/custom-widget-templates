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

const createFilterOptionsByFieldName = (
  issues: JiraIssue[],
  fieldName: string,
  property: string,
) => {
  const options = issues.reduce((obj, issue) => {
    const value = issue.fields[fieldName] && issue.fields[fieldName][property];
    if (value) {
      if (!obj[value]) {
        obj[value] = {
          key: issue.id,
          value,
          docCount: 1,
        };
      } else {
        obj[value].docCount += 1;
      }
    }

    return obj;
  }, {});

  return Object.values(options);
};

const createIssueTypeFilters = (issues: JiraIssue[]) => {
  const options = createFilterOptionsByFieldName(issues, "issuetype", "name");

  const issueTypeFilter = {
    key: "issueType",
    label: "Issue Type",
    type: "checkbox",
    options,
  };

  return issueTypeFilter;
};

const createIssueStatusFilters = (issues: JiraIssue[]) => {
  const options = createFilterOptionsByFieldName(issues, "status", "name");

  const issueStatusFilter = {
    key: "issueStatus",
    label: "Issue Status",
    type: "checkbox",
    options,
  };
  return issueStatusFilter;
};

const createIssueAssigneeFilters = (issues: JiraIssue[]) => {
  const options = createFilterOptionsByFieldName(
    issues,
    "assignee",
    "displayName",
  );

  const issueStatusFilter = {
    key: "issueAssignee",
    label: "Issue Assignee",
    type: "checkbox",
    options,
  };
  return issueStatusFilter;
};

const createIssueCreatorFilters = (issues: JiraIssue[]) => {
  const options = createFilterOptionsByFieldName(
    issues,
    "creator",
    "displayName",
  );

  const issueStatusFilter = {
    key: "issueCreator",
    label: "Issue Creator",
    type: "checkbox",
    options,
  };
  return issueStatusFilter;
};

const createAvailableFilters = (issues: JiraIssue[]) => {
  return [
    createIssueTypeFilters(issues),
    createIssueStatusFilters(issues),
    createIssueAssigneeFilters(issues),
    createIssueCreatorFilters(issues),
  ];
};

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

    const jiraIssues: JiraIssue[] = response.issues || [];
    const filters = createAvailableFilters(response.issues);

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
      filters,
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
