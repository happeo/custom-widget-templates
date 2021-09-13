const { getToken } = require("../store");
const verifyZendeskAuth = (req, res, next) => {
  try {
    const { user } = res.locals;
    const accessTokenData = getToken(user.organisationId);
    if (!accessTokenData) res.status(401).send();

    res.locals.user = {
      ...user,
      accessToken: accessTokenData.access_token,
    };

    next();
  } catch (e) {
    res.status(401).send();
  }
};

module.exports = { verifyZendeskAuth };
