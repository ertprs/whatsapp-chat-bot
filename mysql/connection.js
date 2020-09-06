const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'bwllexywjrxjbvq7zp6a-mysql.services.clever-cloud.com',
  user: 'urcut9lqk0pfolej',
  database: 'bwllexywjrxjbvq7zp6a',
  password: 'YcKeZz7dMOM5N7InDjLj',
  multipleStatements: true,
});
mysqlConnection.connect((error) => {
  if (!error) {
    console.log('Database Connected!');
  } else {
    console.log('Database connection failure!');
  }
});

module.exports = mysqlConnection;
