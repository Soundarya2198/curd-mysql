const express = require("express");
const bodyparser = require("body-parser");
const tickets = require("./routes/tickets");
const authRoute = require("./routes/auth");
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/api/tickets", tickets);
app.use("/api/login", authRoute);

app.listen(3000, () => {
  console.log("Server started at port", 3000);
});
