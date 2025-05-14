import dotenv from 'dotenv'
dotenv.config()

const mysql =  require('mysql')

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect((err) => {
if (err) throw err;
console.log('Database is connected successfully !');
});

module.exports = con;