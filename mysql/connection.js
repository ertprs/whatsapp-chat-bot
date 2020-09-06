const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'visit',
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