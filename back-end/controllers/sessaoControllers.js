const db = require('../models/connect.js'); 
const Sessao = db.Sessao;
const Atividade = db.Atividade


const { ErrorHandler } = require("../utils/error.js");

let getAllSessions = async (req, res, next) => {
    try {
        const Sessions = await Sessao.findAll({
            attributes: ['sessao_id', 'atividade_id','dataMarcada', 'horaMarcada', 'Vagas']
        })
        if(!Sessions){
            throw new ErrorHandler(404, 'Cannot find the data requested')
        }
        return res.status(200).json(Sessions)
    } catch (err) {
        next(err)
    }
}

let addSessao = async (req, res, next) =>{
    let {nome, dataMarcada, horaMarcada, vagas} = req.body
    let nSessao = {dataMarcada, horaMarcada, vagas}
    let nomeA = {nome}
    try{
        const ativityId = await Atividade.findOne({
            attributes : ['atividade_id'],
            where: {
                nome : nomeA.nome
            }
        })
        if(!ativityId){
            throw new ErrorHandler(404, 'A atividade que desejar criar esta sessao nao foi encontrada')
        }
        let atividade_id = ativityId.dataValues.atividade_id
        nSessao = {atividade_id, dataMarcada, horaMarcada, vagas}
        console.log(nSessao)
        await Sessao.create(nSessao);
        res.status(201).json({
            msg: 'Sessao criada com sucesso'
        })
    } catch (err) {
        next(err)
    }
}

let apagarSessao = async (req, res, next) => {
    const sessao_id = req.params.id
    try {
        await Sessao.destroy({
            where: {
                sessao_id : sessao_id
                
            }
        })        
       res.status(204).json({
        msg: 'a sua sessao foi apagada',
       })
    } catch (err) {
        next(err)
    }
}

let getSessionByDate = async (req, res, next) => {
    const { sessionDate } = req.body;
    try {
        let Sessions = await Sessao.findAll({
            attributes: ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas' ],
            where: {
                dataMarcada : sessionDate
            }
        })
        const plainSessions = Sessions.map(session => session.get({ plain: true }));
        console.log(plainSessions)
        return res.status(200).json({
            data: plainSessions
        })
    } catch (err) {
        next(err)
    }
}
    


module.exports = {
    getAllSessions,
    addSessao,
    apagarSessao,
    getSessionByDate
}