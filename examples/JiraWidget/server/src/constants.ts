if (process.env.ENVIRONMENT !== "production") require("dotenv").config();

const {
  CLIENT_ID = "B4FAc3kGMeAM0ltRQjZdDesjth5XI3NY", //"n1KOcR6G986BkCLr81dvjfT6iQ4pwFhR",
  CLIENT_SECRET_KEY = "jira-client-secret",
  SHARED_SECRET_KEY = "happeo-shared-secret",
  KMS_LOCATION = "europe-west1",
  PROJECT_NAME = "happeo-jira-integration",
  KEYRING_NAME = "token_keys",
  OAUTH_CALLBACK_AFTER_REDIRECT_URL = "/oauth/result",
  OAUTH_CALLBACK_URL = "http://localhost:8081/oauth/callback",
} = process.env;

const BASE_URL = "https://api.atlassian.com";
const AUTH_BASE_URL = "https://auth.atlassian.com";
const SCOPES = "read:jira-user read:jira-work offline_access";
const SECRETS_PROJECT = `projects/${PROJECT_NAME}`;
const KEYRING_ADDRESS = `projects/${PROJECT_NAME}/locations/${KMS_LOCATION}/keyRings/${KEYRING_NAME}`;

export {
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET_KEY,
  OAUTH_CALLBACK_URL,
  SCOPES,
  OAUTH_CALLBACK_AFTER_REDIRECT_URL,
  AUTH_BASE_URL,
  PROJECT_NAME,
  SECRETS_PROJECT,
  KMS_LOCATION,
  KEYRING_NAME,
  KEYRING_ADDRESS,
  SHARED_SECRET_KEY,
};

//https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=XicmJh3EQnzJAsKKUQLZscZJQOl88l2w&scope=read%3Ajira-user%20read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20manage%3Ajira-data-provider&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Foauth%2Fcallback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent
