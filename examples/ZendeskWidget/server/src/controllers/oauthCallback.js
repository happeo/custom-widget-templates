const { getHappeoRedirectUrl } = require("../services/happeo");
const { verifySharedToken } = require("../services/jwt");
const { exchangeCodeToToken } = require("../services/zendesk");
const { storeToken } = require("../store");

/**
 * Callback of Zendesk OAuth process.
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async function oauthCallback(req, res) {
  const { code, state, error } = req.query;

  const verifiedToken = verifySharedToken(state);

  try {
    if (error) {
      res.status(400);
      return;
    }

    const token = await exchangeCodeToToken(code);
    storeToken(verifiedToken, token);

    res.redirect(
      `${getHappeoRedirectUrl(state, token, code).href}&success=true`,
    );
  } catch (err) {
    console.log(e);
    res.redirect(
      `${getHappeoRedirectUrl(state, token, code).href}&success=false`,
    );
  }
};
