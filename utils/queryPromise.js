const db = require("../config/db");

function queryPromise(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
module.exports.queryPromise = queryPromise;
