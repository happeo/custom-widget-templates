if (process.env.ENVIRONMENT !== "production") require("dotenv").config();

// Zendesk project url ex. https://{project_name}.zendesk.com
const BASE_URL = process.env.BASE_URL;

// Zendesk OAuth client id & secret
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const SCOPES = "tickets:read tickets:write users:read hc:read read";

const OAUTH_CALLBACK_AFTER_REDIRECT_URL =
  process.env.OAUTH_CALLBACK_AFTER_REDIRECT_URL;

const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL;

module.exports = {
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  OAUTH_CALLBACK_URL,
  SCOPES,
  OAUTH_CALLBACK_AFTER_REDIRECT_URL,
};
