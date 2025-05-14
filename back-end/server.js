const con = require('./database');
const express = require('express');
const app = express()

let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;


app.listen(PORT, HOST, (error) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


