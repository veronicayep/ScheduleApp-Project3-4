const mysql = require("mysql");
const config = require("./config");

const conn = mysql.createConnection(config);

// todo: create the users table (in case none exists)
const createUsersTable = ``;

// todo: create schedules table (in case none exists)
const createSchedulesTable = ``;

conn.connect((err) => {
  if (err) {
    console.log("Error connecting to DB.");
    return;
  }

  conn.query(createUsersTable, (err, rows) => {
    if (err) throw err;
  });
  conn.query(createSchedulesTable, (err, rows) => {
    if (err) throw err;
  });
});
