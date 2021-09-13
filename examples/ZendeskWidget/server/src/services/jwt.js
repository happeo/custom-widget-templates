const jwt = require("jsonwebtoken");

const SHARED_SECRET =  process.env.SHARED_SECRET

function createToken(data) {
  return jwt.sign(data, SHARED_SECRET, { expiresIn: "5min" });
}

function verifySharedToken(token) {
  try {
    return jwt.verify(token, SHARED_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  createToken,
  verifySharedToken,
};
