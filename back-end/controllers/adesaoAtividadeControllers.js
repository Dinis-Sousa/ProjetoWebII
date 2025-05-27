const db = require('../models/connect')
const AdesaoAtividade = db.AdesaoAtividade
const Atividade = db.Atividade;
const School = db.School;

const {ErrorHandler} = require('../utils/error')

let getAllAdesoes = async (req, res, next) => {
    try {
        const Adesoes = await AdesaoAtividade.findAll({
            attributes : ['atividade_id', 'escola_id', 'aderiu']
        })
        if(!Adesoes){
            throw new ErrorHandler(404, 'Nenhuma adesao encontrada')
        }
        const plainAdesoes = Adesoes.map(Adesao => Adesao.get({ plain: true }));
        return res.status(200).json(plainAdesoes);
    } catch (err) {
        next(err)
    }
}

let addAdesao = async (req, res, next) => {
    const {atividade_id, escola_id} = req.body
    const newInfo = {atividade_id, escola_id}
    try {  
        const atividadeName = await Atividade.findOne({
            attributes : ['nome'],
            where: {
                atividade_id : newInfo.atividade_id
            }
        })
        if(!atividadeName){
            throw new ErrorHandler(404, `A atividade nao existe!`)
        }
        const escolaName = await School.findOne({
            attributes : ['nome'],
            where: {
                escola_id : newInfo.escola_id
            }
        })
        if(!escolaName){
            throw new ErrorHandler(404, `A escola nao existe!`)
        }

        await AdesaoAtividade.create(newInfo)
        res.status(201).json({
            msg: `A ${escolaName.dataValues.nome} aderiu à atividade ${atividadeName.dataValues.nome}`
        })
    } catch (err){
        next(err)
    }
}

let apagarAdesao = async (req, res, next) => {
    const {atividade_id, escola_id} = req.body
    try {
        await AdesaoAtividade.destroy({
            where : {
                atividade_id : atividade_id,
                escola_id : escola_id
            }
        })
        res.status(204).json({
            msg: 'ADESAO APAGADA COM SUCESSO'
        })
    }catch (err) {
        next(err)
    }
}

module.exports = {
    getAllAdesoes,
    addAdesao,
    apagarAdesao,
}