require("dotenv").config(); // MUST be first
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
// const tickets = require("./routes/tickets");

const tickets = require("./routes/dynamo_ticket");
// const authRoute = require("./routes/auth");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/api/tickets", tickets);
// app.use("/api/login", authRoute);

app.listen(3000, () => {
  console.log("Server started at port", 3000);
});
