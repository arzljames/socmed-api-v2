const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

// global declaration
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_TOKEN_EXPIRATION;

exports.createToken = (payload) => {
  const access_token = sign(payload, secret, { expiresIn: expiration });
  return access_token;
};

exports.verifyToken = (token) => {
  const isValid = verify(token, secret);

  return isValid;
};
