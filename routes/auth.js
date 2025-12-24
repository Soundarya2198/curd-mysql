const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("../utils/jwt");
const bodyParser = require("body-parser");
const query = require("../utils/queryPromise");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json("Email and password cannot be blank");
    }

    const sql = "select * from users where email = ?";
    const result = await query.queryPromise(sql, [email]);
    if (result.length == 0) {
      return res.status(400).json("Invalid username and password");
    }
    const user = result[0];

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid username and password");
    }

    const token = jwt.generateToken({
      id: user.id,
      email: user.email,
    });
    return res.status(200).json(token);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e.message);
  }
});

module.exports = router;
