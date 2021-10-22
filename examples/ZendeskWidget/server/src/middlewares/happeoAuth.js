const { verifySharedToken } = require("../services/jwt");

const verifyHappeoAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const verifiedToken = verifySharedToken(token);

    res.locals.user = {
      ...verifiedToken.user,
      organisationId: verifiedToken.organisation.id,
    };

    next();
  } catch (e) {
    res.status(401).send();
  }
};

module.exports = { verifyHappeoAuth };
