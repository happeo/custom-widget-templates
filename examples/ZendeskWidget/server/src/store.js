// temporary memory solution
const tokens = {};

const storeToken = (tokenData, accessToken) => {
  tokens[tokenData.organisation.id] = accessToken;
};

const getToken = (organisationId) => tokens[organisationId];

module.exports = { storeToken, getToken };
