const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const {addActivity} = require('./models/atividade_models')

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

app.post('/api/input', (req, res) => {
    const input = req.body.data;
    console.log(input)
    let result = getUsers(input);
    res.send(result)
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
        res.json(results); 
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

let nomeA = 'varrer a escola';
let descricaoA = 'varrer com a vassora todos os edificios da esmad';
let dataI = new Date("2025-05-25");
let dataF = new Date("2025-05-25");
let estado = 'PENDENTE'

addActivity(2, 1, nomeA, descricaoA, dataI, dataF, estado);

app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


