const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const {addActivity, getAllAtivities} = require('./models/atividade_models');
const { getUsers, getAllUsers } = require('./models/user_models');


let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        let answer = 'BEM VINDO AO NOSSO SERVIDOR';
        res.send(answer);
    } catch (err) {
        res.status(500).send('SERVER IS BROKEN')
    }
})

app.get('/users', async (req, res) => {
    try {
        const results = await getAllUsers();
        res.json(results); 
    } catch (error) {
        res.status(500).send('SERVER IS BROKEN');
        console.error(error);
    }
});

app.post('/api/input', async (req, res) => {
    let myObj = req.body.data
    console.log(myObj.nome)
     try {
        const results = await addActivity(myObj.eid,myObj.aid, myObj.nome, myObj.desc, myObj.dateInicio, myObj.dateFim, myObj.estado);
        res.send(results);
    } catch (err) {
        console.error(err)
    }
})

app.post('/registar', async (req, res) => {
    req.body(escola, nome, email, password)
})


app.post('/registarEscola', async (req, res) => {
    req.body(nome, morada, codigo, local, tele, email, nivel);
    addSchool(nome, morada, codgo, local, tele, email, nivel);
    res.send('Escola adicionada');
})

app.get('/atividade', async (req, res) => {
    try {
        const results = await getAllAtivities();
        res.send(results); 
    } catch (error) {
        res.status(500).send('SERVER IS BROKEN');
        console.error(error);
    }
});

app.get('/escola', async (req, res) => {
    try {
        const results = await getAllSchools();
        res.send(results); 
    } catch (error) {
        res.status(500).send('SERVER IS BROKEN');
        console.error(error);
    }
});

app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


