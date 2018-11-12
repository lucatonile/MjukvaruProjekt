var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'mydb',
    password: 'bikeini'
});

connection.connect(function(err) {
    if (err) console.log(err);
    //throw err
});

module.exports = connection;