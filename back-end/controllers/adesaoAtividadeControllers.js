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
    const atividade_id = req.params.atividade_id;
    const escola_id = req.params.escola_id;
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
    const atividade_id = req.params.atividade_id;
    const escola_id = req.params.escola_id;
    const newInfo = {atividade_id, escola_id}
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

let escolasPorAtividade = async (req, res, next) => {
    const atividade_id = req.params.atividade_id;
    let names = [];
    try {
        let allSchools = await AdesaoAtividade.findAll({
            attributes: ['escola_id', 'aderiu'],
            where: { atividade_id : atividade_id }
        });

        for (const school of allSchools) {
            let escolaID = school.dataValues;
            try {
                let SchoolsName = await School.findAll({
                    attributes: ['nome'],
                    where: { escola_id: escolaID.escola_id }
                });
                SchoolsName.forEach(nome => {
                    names.push(nome.dataValues);
                });
            } catch (err) {
                return next(err);
            }
        }

        res.status(200).json(names);

    } catch (err) {
        next(err);
    }
};

let ativitiesBySchool = async (req, res, next) => {
    const escola_id = req.params.escola_id;
    let names = [];
    try {
        let allAtivities = await AdesaoAtividade.findAll({
            attributes: ['atividade_id', 'aderiu'],
            where: { escola_id : escola_id }
        });

        for (const ativity of allAtivities) {
            let ativityID = ativity.dataValues;
            try {
                let AtivitiesNames = await Atividade.findAll({
                    attributes: ['nome'],
                    where: { atividade_id: ativityID.atividade_id }
                });
                AtivitiesNames.forEach(nome => {
                    names.push(nome.dataValues);
                });
            } catch (err) {
                return next(err);
            }
        }

        res.status(200).json(names);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllAdesoes,
    addAdesao,
    apagarAdesao,
    escolasPorAtividade,
    ativitiesBySchool
}