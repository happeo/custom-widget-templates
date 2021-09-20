export const SETTINGS_KEYS = {
  resourceId: "resourceId",
  jql: "jql",
  selectedColumns: "selectedColumns",
};

export const ORDER_BY_REGEX = /order by (\w+) (\w+)/im;

export const ISSUE_FIELDS = {
  issuetype: "issuetype",
  key: "key",
  summary: "summary",
  priority: "priority",
  created: "created",
  duedate: "duedate",
  updated: "updated",
  assignee: "assignee",
  reporter: "reporter",
  status: "status",
};

export const DEFAULT_COLUMNS = [
  "issuetype",
  "key",
  "summary",
  "priority",
  "created",
  "assignee",
];

export const AVAILABLE_COLUMNS = [
  {
    label: "Type",
    field: "issuetype",
    name: "T",
    width: "10%",
    gridWidth: "40px",
    sortable: true,
  },
  {
    label: "Key",
    name: "Key",
    field: "key",
    width: "10%",
    gridWidth: "100px",
    sortable: true,
  },
  {
    label: "Summary",
    name: "Summary",
    field: "summary",
    width: "30%",
    gridWidth: "1fr",
    sortable: true,
  },
  {
    label: "Priority",
    name: "P",
    field: "priority",
    width: "10%",
    gridWidth: "40px",
    sortable: true,
  },
  {
    label: "Created",
    name: "Created",
    field: "created",
    width: "20%",
    gridWidth: "120px",
    sortable: true,
  },
  {
    label: "Due Date",
    name: "Due Date",
    field: "duedate",
    width: "20%",
    gridWidth: "120px",
    sortable: true,
  },
  {
    label: "Updated",
    name: "Updated",
    field: "updated",
    width: "20%",
    gridWidth: "120px",
    sortable: true,
  },
  {
    label: "Assignee",
    name: "Assignee",
    field: "assignee",
    width: "20%",
    gridWidth: "180px",
    sortable: true,
  },
  {
    label: "Reporter",
    name: "Reporter",
    field: "reporter",
    width: "20%",
    gridWidth: "180px",
    sortable: true,
  },
  {
    label: "Status",
    name: "Status",
    field: "status",
    width: "20%",
    gridWidth: "100px",
    sortable: true,
  },
];
export const WIDGET_SETTINGS = [
  {
    placeholder: "Max results",
    key: "maxResults",
    value: 10,
    minValue: 2,
    maxValue: 50,
    type: "number",
  },
  {
    placeholder: "Input JQL",
    key: SETTINGS_KEYS.jql,
    value: "",
    type: "text",
  },
  {
    placeholder: "What is JQL?",
    key: "jqlHelp",
    value:
      "https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/",
    type: "help-link",
  },
  {
    placeholder: "Selected columns",
    key: SETTINGS_KEYS.selectedColumns,
    value: JSON.stringify(DEFAULT_COLUMNS),
    type: "text",
    hide: true,
  },
];

export const HELP_URL = "https://www.google.com";

export const POPUP_PARAMS =
  "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=100,top=100";
export const BASE_URL = "http://localhost:8081";

export const WIDGET_LOCATION = {
  pages: "pages",
  search: "search",
};
