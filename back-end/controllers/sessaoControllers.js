const db = require('../models/connect.js'); 
const Sessao = db.Sessao;
const Atividade = db.Atividade


const { ErrorHandler } = require("../utils/error.js");

let getAllSessions = async (req, res, next) => {
    class SessionToPresent {
        constructor(sessao_id, nome, dataMarcada, horaMarcada, vagas){
            this.sessao_id = sessao_id;
            this.nome = nome;
            this.dataMarcada = dataMarcada;
            this.horaMarcada = horaMarcada;
            this.vagas = vagas;
        }
    }
    try {
        const Sessions = await Sessao.findAll({
            attributes: ['sessao_id', 'atividade_id','dataMarcada', 'horaMarcada', 'Vagas']
        })
        if(!Sessions){
            throw new ErrorHandler(404, 'Cannot find the data requested')
        }
        const mySessions = []
        let i = 0;
        Sessions.forEach(async session => {
            const atividadeName = await Atividade.findOne({
                where: {
                    atividade_id : session.dataValues.atividade_id
                }
            })
            let sessionF = new SessionToPresent(Sessions[i].dataValues.sessao_id, atividadeName.dataValues.nome, Sessions[i].dataValues.dataMarcada, Sessions[i].dataValues.horaMarcada, Sessions[i].dataValues.Vagas)
            mySessions.push(sessionF)
            i += 1;
            if(i == Sessions.length){
                return res.status(200).json(mySessions)
            }
        });
    } catch (err) {
        next(err)
    }
}

let addSessao = async (req, res, next) =>{
    let {atividade_id, dataMarcada, horaMarcada, vagas} = req.body
    let nSessao = {atividade_id, dataMarcada, horaMarcada, vagas}
    try{
        await Sessao.create(nSessao);
        res.status(201).json({
            msg: 'Sessao criada com sucesso'
        })
    } catch (err) {
        next(err)
    }
}

let apagarSessao = async (req, res, next) => {
    const sessao_id = req.params.sessao_id
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