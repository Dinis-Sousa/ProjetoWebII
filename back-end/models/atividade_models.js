const con = require('../connect');
const ErrorHandler = require('../utils/error')

let getAllAtivities = () => {
        con.query(`SELECT * FROM Atividade`, (err, results) => {
            console.log(results)
            results.forEach(result => {
                return result
            });
        });
    };


let addActivity = (escolaid, areaid, nome, descricao, dataInicio, dataFim, estado) => {
    
        con.query(`INSERT INTO Atividade(escola_id, area_id, nome, descricao, dataInicio, dataFim, estado) VALUES(?,?,?,?,?,?,?)`,[escolaid, areaid, nome, descricao, dataInicio, dataFim, estado], (err) => {
        return console.log('A ATIVIDADE FOI ADICIONADA COM SUCESSO')
    });
};

module.exports = {addActivity, getAllAtivities}