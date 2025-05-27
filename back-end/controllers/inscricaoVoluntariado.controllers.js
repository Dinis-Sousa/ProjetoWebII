const db = require('../models/connect.js')
const InscritosSessao = db.InscritosSessao;
const Utilizador = db.Utilizador;

const { ErrorHandler } = require("../utils/error.js");

let gettAllInscricoes = async (req, res, next) => {
    const {sessao_id, user_id} = req.body
    const myInfo = {sessao_id, user_id}
    try {
        const Inscricoes = await InscritosSessao.findAll({
            attributes : ['sessao_id', 'user_id', 'presenca']
        })
        if(!Inscricoes){
            throw new ErrorHandler(404, `nao foram encontradas sessoes`)
        }
        const plainInscricoes = Inscricoes.map(inscricao => inscricao.get({ plain: true }));
        return res.status(200).json(plainInscricoes);
    } catch (err){
        next(err)
    }
}


let inscrever = async (req, res, next) => {
    const {sessao_id, user_id} = req.body
    const myInfo = {sessao_id, user_id}
    try {
        const userName = await Utilizador.findOne({
            attributes : ['nome'],
            where : {
                user_id : myInfo.user_id
            }
        })
        if(!userName){
            throw new ErrorHandler(404, `O utlizador nao existe`)
        }

        await InscritosSessao.create(myInfo)
        res.status(201).json({
            msg: `o user ${userName.dataValues.nome} está inscrito nesta sessao!`
        })
    } catch (err) {
        next(err)
    }
}

let removerInscricao = async (req, res, next) => {
    const {sessao_id, user_id} = req.body
    try {
        await InscritosSessao.destroy({
            where: {
                sessao_id :sessao_id,
                user_id : user_id
            }
        })
        res.status(204)
    } catch (err) {
        next(err)
    }
}


    
let marcarPresenca = async (req, res, next) => {
      const { sessao_id, user_id } = req.body;
    try {
        const inscricao = await InscritosSessao.findOne({
            where: {
                sessao_id,
                user_id
            }
        });

        if (!inscricao) {
            throw new ErrorHandler(404, "Inscrição não encontrada");
        }

        inscricao.presenca = !inscricao.presenca;
        await inscricao.save();

        res.status(200).json({
            msg: "Presença atualizada",
            presenca: inscricao.presenca
        });

    } catch (err){
        next(err)
    }
}

module.exports = {
    marcarPresenca,
    inscrever,
    gettAllInscricoes,
    removerInscricao,
}