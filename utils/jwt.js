const jwt = require("jsonwebtoken");

const secret = "MysecretToken";

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "5s" });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
