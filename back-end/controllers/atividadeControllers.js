const db = require('../models/connect.js'); 
const Atividade = db.Atividade; 


const { ErrorHandler } = require("../utils/error.js");

let getAllAtividades = async (req, res, next) => {
    try {
        const Atividade = await Atividade.findAll({
            attributes: ['atividade_id', 'area_id', 'nome','descrição', 'dataInicio', 'dataFim', 'estado']
        })
        if(!Atividade){
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.body.id}.`)
        }

        return res.status(200).json({
            data: Atividade
        });
    } catch (err) {
        next(err);
    }
}

let addAtividade = async (req, res, next) => {
    try {
        const atividade = await Atividade.create(req.body);
        res.status(201).json({
            msg:"atividade criada com sucesso"
        });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllAtividades,
    addAtividade,
}