let dotenv = require('dotenv')
dotenv.config()

const mysql =  require('mysql')

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


let getAllUsers = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Utilizador`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

let getUsers = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Utilizador WHERE user_id = ${id}`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
            console.log(results[0])
        });
    });
};

let getAllAtivities = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Atividade`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

let getAllSchools = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Escola`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

let addSchool = (nome, morada, codigo, local, tele, email, nivel) => {
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO Escola(nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao) VALUES(?,?,?,?,?,?,?)`,[nome, morada, codigo, local, tele, email, nivel], (err) => {
        if (err) throw reject(err);
        resolve(console.log('ADICIONADA COM SUCESSO!!!!!!!!!'));
    });
})};

con.connect((err) => {
if (err) throw err;
console.log('Database is connected successfully !');
});

module.exports = {con, getAllUsers, getUsers, getAllAtivities, getAllSchools,addSchool}