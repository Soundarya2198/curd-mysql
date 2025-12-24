const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "issues",
});

db.connect((err) => {
  if (err) {
    console.log("Error in mysql", err);
  } else {
    console.log("Connection is sucessfull");
  }
});

module.exports = db;
