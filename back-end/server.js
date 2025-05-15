const express = require('express');
const app = express()
const {getAllUsers} = require('./connect')

let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const results = await getAllUsers();
        res.json(results); 
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error(error);
    }
});
 


app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


