const {
  BASE_URL,
  CLIENT_ID,
  OAUTH_CALLBACK_URL,
  SCOPES,
} = require("../constants");
const { verifySharedToken } = require("../services/jwt");

/**
 * Callback of Zendesk OAuth process. Drawbridge does not authenticate the user because of custom domains.
 * So we use JWT token from query parameters instead for authentication
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async function oauthBegin(req, res) {
  const { token } = req.query;

  verifySharedToken(token);

  const authorize = new URL(`${BASE_URL}/oauth/authorizations/new`);
  authorize.searchParams.append("response_type", "code");
  authorize.searchParams.append("client_id", CLIENT_ID);
  authorize.searchParams.append("redirect_uri", OAUTH_CALLBACK_URL);
  authorize.searchParams.append("state", token);
  authorize.searchParams.append("scope", SCOPES);

  res.redirect(authorize);
};
