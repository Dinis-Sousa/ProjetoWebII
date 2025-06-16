const db = require('../models/connect')
const School = db.School

const {ErrorHandler} = require('../utils/error')

let getAllSchool = async (req, res, next) =>{
    try { 
        const Schools = await School.findAll()
        if(!Schools){
            return new ErrorHandler(404, `Cannot find the data requested`)
        }
        return res.status(200).json(Schools)
    } catch (err){
        next(err);
    }
}

let addSchool = async (req, res, next) => { 
    let {nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao} = req.body;
    let nEscola = {nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao}
    console.log(nEscola)
    try{
    await School.create(nEscola);
        res.status(201).json({
            msg: 'Escola foi adicionada com sucesso'
        })
    } catch (err) {
        next(err)
    }
}

let apagarSchool = async (req, res, next) => {
    let school_id = req.params.escola_id
    try {
        await School.destroy({
            where : {
                escola_id : school_id
            }
        })
        res.status(204).json({
            msg: 'ESCOLA APAGADA COM SUCESSO'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getAllSchool, 
    addSchool,
    apagarSchool
}