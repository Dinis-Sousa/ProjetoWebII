const db = require('../models/connect.js'); 
const Atividade = db.Atividade;
const Sessao = db.Sessao 


const { ErrorHandler } = require("../utils/error.js");

let getAllAtividades = async (req, res, next) => {
    try {
        const Atividades = await Atividade.findAll({
            attributes: ['atividade_id', 'area_id', 'nome','descricao', 'dataInicio', 'dataFim', 'estado']
        })
        if(!Atividades || Atividades.length === 0){
            throw new ErrorHandler(404, 'Atividade nao existem!')
        }
        return res.status(200).json(Atividades);
    } catch (err) {
        next(err);
    }
}

let addAtividade = async (req, res, next) => {
    const {nome, descricao, area_id, dataInicio, dataFim, estado} = req.body
    const myInfo = {nome, descricao, area_id, dataInicio, dataFim, estado}
    console.log(myInfo)
    try {
        await Atividade.create(myInfo);
        res.status(201).json({
            msg:"atividade criada com sucesso"
        });
    } catch (err) {
        next(err)
    }
}
let apagarAtividade = async (req, res, next) => {
    const {atividade_id} = req.body
    console.log(atividade_id)
    try {
        await Atividade.destroy({
            where: {
                atividade_id : atividade_id
            }
        })
        return res.status(204).json({
            msg: 'Atividade apagada com sucesso'
        })
    } catch (err) {
        next(err)
    }
}

let alterarEstado = async (req, res, next) => {
    const atividade_id = req.params.atividade_id
    const {estado} = req.body
    const newInfo = {estado}
    try {
        const NAtividade = await Atividade.findOne({
            where : {
                atividade_id : atividade_id
            }
        })
        if(!Atividade){
            throw new ErrorHandler(404, 'Nao foi encontrada a atividade desejada!')
        }
        NAtividade.estado = newInfo.estado
        await NAtividade.save()

        res.status(200).json({
            msg: "estado atulizado",
            estado: NAtividade.estado
        });
    } catch (err) {
        next(err)
    }
}

let getSessionsByAtivity = async (req, res, next) => {
    const {atividade_id} = req.params.id
    try {
        const Sessions = Sessao.findAll({
            attributes : ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas'],
            where : {
                atividade_id : atividade_id
            }
        })
        if(!Sessions) {
            throw new ErrorHandler(404, 'nao foram encontradas sessões desta Atividade')
        }
        return res.status(200).json({
            data: Sessions
        });
    } catch (err) {
        next(err)
    }
}

let getAtivityNameById = async (req, res, next) => {
    const {atividade_id} = req.params.atividade_id;
    try {
        const nameAtivity = findOne({
            attributes: ['nome'],
            where: {
                atividade_id : atividade_id
            }
        })
        if(!nameAtivity){
            throw new ErrorHandler(404, 'Atividade com esse id não encontrada!')
        }

        res.statusCode(200).json(nameAtivity)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getAllAtividades,
    addAtividade,
    alterarEstado,
    apagarAtividade,
    getSessionsByAtivity,
    getAtivityNameById
}