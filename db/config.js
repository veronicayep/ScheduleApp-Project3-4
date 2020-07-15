const mysql = require("mysql");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'   // database name
});

connection.connect(function(err) {
  if (err) throw err;
  // if connection is successful
  console.log("Connected");
});

module.exports = connection;



