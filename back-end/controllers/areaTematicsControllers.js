const db = require('../models/connect')
const Area = db.Area
const Atividade = db.Atividade

const {ErrorHandler} = require('../utils/error')

let getAllAreas = async (req, res, next) => {
    try{
        const Areas = await Area.findAll({
            attributes: [`area_id`, `nome`, `descricao`]
        })
        if(!Areas){
            throw new ErrorHandler(404, `NO AREAS WERE FOUND!`)
        }
        return res.status(200).json(Areas)
    } catch (err) {
        next(err);
    }
}
let getSpecificArea = async (req, res, next) => {
    const area_id = req.params.area_id
    try {
        const SpecificArea = await Area.findByPk(area_id)
        if(!SpecificArea){
            throw new ErrorHandler(404, `Area not found!`)
        }
        res.status(200).json(SpecificArea)
    } catch (err){
        next(err)
    }
}

let getAtivitiesByArea = async (req, res, next) => {
    const area_id = req.params.id
    try {
        const Ativities = await Atividade.findAll({
            attributes : ['nome'],
            where: {
                area_id : area_id
            }
        })
        if(!Ativities){
            throw new ErrorHandler(404, `NO AREAS WERE FOUND!`)
        }
        const plainAreas = Ativities.map(area => area.get({ plain: true }));
        return res.status(200).json({
            data: plainAreas
        })
    } catch (err) {
        next(err);
    }
}

let deleteArea = async (req, res, next) => {
    const area_id = req.params.area_id
    try {
        await Area.destroy({
            where: {area_id: area_id}
        })
        res.status(204).json({
            msg: 'area eliminada com sucesso'
        })
    } catch (err) {
        next(err);
    }
}

let addArea = async (req, res, next) => {
    const {nome, descricao} = req.body
    const newArea = {nome, descricao}
    try {
        if(!newArea.nome){
            throw new ErrorHandler(404, `Don't leave the name input empty!`)
        }
        else if(!newArea.descricao){
            throw new ErrorHandler(404, `Don't leave the description input empty!`)

        }
        await Area.create(newArea)
        res.status(201).json({
            msg:'Area criada com sucesso'
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllAreas,
    getAtivitiesByArea,
    deleteArea,
    addArea,
    getSpecificArea,
}