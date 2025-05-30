const db = require('../models/connect.js'); 
const { get } = require('../routes/users.routes.js');
const Sessao = db.Sessao; 


const { ErrorHandler } = require("../utils/error.js");

let getAllSessions = async (req, res, next) => {
    try {
        const Sessions = await Sessao.findAll({
            attributes: ['sessao_id','dataMarcada', 'horaMarcada', 'Vagas']
        })
        if(!Sessions){
            throw new ErrorHandler(404, 'Cannot find the data requested')
        }
        const plainSessions = Sessions.map(session => session.get({ plain: true }));
        console.log(plainSessions)
        return res.status(200).json({
            data: plainSessions
        })
    } catch (err) {
        next(err)
    }
}

let addSessao = async (req, res, next) =>{

    const sessaoId = await Sessao.findAll({
        attributes : ['sessao_id']
    })
    const plainSessions = Sessions.map(session => session.get({ plain: true }));
    let sessao_id = plainSessions.length
    let {dataMarcada, horaMarcada, vagas} = req.body
    let nSessao = {sessao_id, dataMarcada, horaMarcada, vagas}
    console.log(nSessao)
    try {
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
    


module.exports = {
    getAllSessions,
    addSessao,
    apagarSessao,
}