const jwt = require("jsonwebtoken");

const SHARED_SECRET =
  process.env.SHARED_SECRET ||
  "8b47c6eaf9a3e9ed2b68b34cfd11ac7393a2349d21985ad2ae7a2fd632806557";

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
