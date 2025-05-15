const express = require('express');
const app = express()
const {getAllUsers, getUsers, getAllAtivities, getAllSchools} = require('./connect')

let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;

app.get('/users', async (req, res) => {
    try {
        const results = await getAllUsers();
        res.json(results); 
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error(error);
    }
});

app.get('/atividade', async (req, res) => {
    try {
        const results = await getAllAtivities();
        res.json(results); 
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error(error);
    }
});

app.get('/escola', async (req, res) => {
    try {
        const results = await getAllSchools();
        res.json(results); 
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error(error);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const results = await getUsers(id);
        res.json(results); 
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error(error);
    }
});


app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


