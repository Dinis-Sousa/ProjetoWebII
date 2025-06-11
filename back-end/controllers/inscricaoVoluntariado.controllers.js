const db = require('../models/connect.js')
const InscritosSessao = db.InscritosSessao;
const Utilizador = db.Utilizador;

const { ErrorHandler } = require("../utils/error.js");

let getTheRegistration = async (req, res, next) => {
    const user_id = req.params.user_id
    const sessao_id = req.params.sessao_id
    try {
        const Inscricoes = await InscritosSessao.findAll({
            attributes : ['sessao_id', 'user_id', 'presenca'],
            where : {
                sessao_id : sessao_id,
                user_id : user_id
            }
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
    const user_id = req.params.user_id
    const sessao_id = req.params.sessao_id
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
    const user_id = req.params.user_id;
    const sessao_id = req.params.sessao_id;
    try {
        await InscritosSessao.destroy({
            where: {
                sessao_id :sessao_id,
                user_id : user_id
            }
        })
        res.status(204).json({
            msg: 'Inscrição do user removida!'
        })
    } catch (err) {
        next(err)
    }
}


    
let marcarPresenca = async (req, res, next) => {
      const user_id = req.params.user_id;
      const sessao_id = req.params.sessao_id;
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

let listOfUsersBySession = async (req, res, next) => {
    const sessao_id = req.params.sessao_id
    class Person  {
        constructor(nome, presenca) {
        this.nome = nome;
        this.presenca = presenca;
    }
    }
    try{
        const Users = await InscritosSessao.findAll({
            attributes : ['user_id', 'presenca'],
            where: {
                sessao_id : sessao_id
            }
        });
        if(!Users || Users.length === 0){
            throw new ErrorHandler(404, 'Não há users inscritos nesta sessão')
        }

        let ArrayOfUsers = []
        
        for(let user in Users){
            const userName = await Utilizador.findOne({
            attributes : ['nome'],
            where: {
                user_id : Users[user].user_id
            }
        });
        let newObj = new Person(userName.nome, Users[user].presenca)
        ArrayOfUsers.push(newObj)
    }
        res.status(200).json(ArrayOfUsers)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    marcarPresenca,
    inscrever,
    getTheRegistration,
    removerInscricao,
    listOfUsersBySession,
}