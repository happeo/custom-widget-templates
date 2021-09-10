const { OAUTH_CALLBACK_AFTER_REDIRECT_URL } = require("../constants");
const { createToken, verifySharedToken } = require("./jwt");

const getHappeoRedirectUrl = (state, token, code) => {
  const { redirect_url } = verifySharedToken(state);
  const newState = createToken({
    cn: "zendesk",
    cv: token.access_token,
  });

  const url = new URL(`${OAUTH_CALLBACK_AFTER_REDIRECT_URL}`);
  const params = {
    code,
    state: newState,
  };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  return url;
};

module.exports = {
  getHappeoRedirectUrl,
};
