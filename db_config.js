const mysql = require('mysql');

const host = "localhost";
const username = "root";
const password = "4321";
const database = "KHUN_MAE";

const conn = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    database: database,
    timezone: 'utc',
    driver: "mysql",
    multipleStatements: true
});

module.exports.conn = conn;