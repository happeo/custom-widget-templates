export interface JiraIssue {
  id: number;
  key: string;
  keyHtml: string;
  img: string;
  summary: string;
  summaryText: string;
  fields: {
    summary: string;
    issuetype: {
      iconUrl: string;
    };
  };
}
