const con = require('../connect');

let getAllAtivities = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Atividade`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


let addActivity = (escolaid, areaid, nome, descricao, dataInicio, dataFim, estado) => {
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO Atividade(escola_id, area_id, nome, descricao, dataI, dataF, estado) VALUES(?,?,?,?,?,?,?)`,[escolaid, areaid, nome, descricao, dataInicio, dataFim, estado], (err) => {
        if (err) throw reject(err);
        resolve(console.log('ADICIONADA COM SUCESSO!!!!!!!!!'));
    });
})};

module.exports = {getAllAtivities, addActivity}