const db = require('../models/connect.js')
const InscritosSessao = db.InscritosSessao;
const Utilizador = db.Utilizador;
const Sessao = db.Sessao;

const { ErrorHandler } = require("../utils/error.js");

let getTheRegistration = async (req, res, next) => {
    const user_id = req.params.user_id
    const sessao_id = req.params.sessao_id
    try {
        const Inscricoes = await InscritosSessao.findOne({
            where : {
                sessao_id : sessao_id,
                user_id : user_id
            }
        })
        return res.status(200).json(Inscricoes);
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
        const removerVaga = await Sessao.findOne({
            where : {
                sessao_id : sessao_id
            }
        })
        
        if(removerVaga.vagas > 0){
            removerVaga.vagas -= 1;
            await removerVaga.save()
            await InscritosSessao.create(myInfo)
            res.status(201).json({
                msg: `o user ${userName.dataValues.nome} está inscrito nesta sessao!`
            })
        } else {
            throw new ErrorHandler(400, `Vagas cheias, por favor procure outras sessoes!`)
        }
    } catch (err) {
        next(err)
    }
}

let removerInscricao = async (req, res, next) => {
    const user_id = req.params.user_id;
    const sessao_id = req.params.sessao_id;
    try {
        const theregistration = await InscritosSessao.findOne({
            where: {
                sessao_id :sessao_id,
                user_id : user_id
            }
        })
        
        if(!theregistration || theregistration.length == 0){
            throw new ErrorHandler(404, `Inscricão não encontrada!`)
        }
        await InscritosSessao.destroy({
            where: {
                sessao_id :sessao_id,
                user_id : user_id
            }
        })
        const removerVaga = await Sessao.findOne({
            where : {
                sessao_id : sessao_id
            }
        })
        
        removerVaga.vagas += 1;
        await removerVaga.save()
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
        constructor(user_id, nome, presenca) {
        this.user_id = user_id;
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
        let newObj = new Person(Users[user].user_id, userName.nome, Users[user].presenca)
        ArrayOfUsers.push(newObj)
    }
        res.status(200).json(ArrayOfUsers)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    inscrever,
    marcarPresenca,
    getTheRegistration,
    removerInscricao,
    listOfUsersBySession,
}