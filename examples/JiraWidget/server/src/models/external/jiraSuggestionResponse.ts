import { JiraIssue } from "./jiraIssue";

export interface JiraSuggestionIssueResponse {
  label: string;
  sub: string;
  id: string;
  msg: string;
  issues: JiraIssue[];
}
