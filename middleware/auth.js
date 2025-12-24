const jwt = require("../utils/jwt");
const secret = "MysecretToken";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers);
  if (!authHeader) {
    return res.status(400).json("Token is missing");
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("Invalid token format");
  }
  try {
    const decoded = jwt.verifyToken(token, secret);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(500).json(e.message);
  }
};
