const express = require('express');
const app = express()
const getAllUsers = require('./database')

let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    let results = getAllUsers()
    res.send(results)
});
 


app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


