const e = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models/connect.js');
require('dotenv').config(); 
const User = db.Utilizador; 
const InscritosSessao = db.InscritosSessao;


const { ErrorHandler } = require("../utils/error.js");

let getSessaoInscritasByUser = async (req, res, next) => {
    const user_id = req.params.id
    console.log(user_id)
    try {
        const userName = await User.findOne({
            attributes : ['nome'],
            where: {
                user_id : user_id
            }
        })
        if(!userName){
            throw new ErrorHandler(404, 'Utilizador nao encontrado')
        }
        let ArrayOfSessions = await InscritosSessao.findAll({
            attributes : ['sessao_id', 'user_id', 'presenca'],
            where : {
                user_id : user_id
            }
        })
        if(!ArrayOfSessions){
            throw new ErrorHandler(404, `Sessoes nao encontradas do user ${userName}`)
        }
        const plainSessions = ArrayOfSessions.map(sessao => sessao.get({plain:true}));
        return res.status(200).json(plainSessions)
    } catch (err) {
        next(err)
    }
}

let getAllUsers = async (req, res, next) => {
    try {
        const Utilizadores = await User.findAll()
        if(!Utilizadores){
            throw new ErrorHandler(404, `There are no users!`)
        }

        return res.status(200).json(Utilizadores);
    } catch (err) {
        console.error(err);
    }
}

let apagarUser = async (req, res, next) => {
    const user_id = req.params.user_id
    try {
        await User.destroy({
            where: {
                user_id : user_id
            }
        })
        res.status(204).send();
    } catch (err) {
        next(err)
    }
}

let checkUser = async (req, res, next) => {
    const {tEmail, passHash} = req.body;
    try {
        const [Utilizador] = await User.findAll({
            where: {
                email : tEmail
            }
        })
        if(!Utilizador){
            throw new ErrorHandler(401, 'Nao existe utilizador com esse email')
        } else {
            const user1 = Utilizador.dataValues
            if(user1.passwordHash == passHash){
                const secretKey = process.env.JWT_SECRET;
                const payload = {
                        user_id : user1.user_id
                        };
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
            console.log('JWT:', token);
                switch(user1.perfil){
                    case 'ALUNO':
                        res.status(200).json({
                            msg: 'Aluno logado',
                            token: token
                        })
                    break;
                    case 'COLABORADOR' :
                        res.status(200).json({
                            msg: 'Colaborador logado',
                            token: token
                        })
                    break;
                    case 'ADMIN': 
                        res.status(200).json({
                            msg: 'Admin logado',
                            token: token
                        })
                    break;
            }
        } else {
            throw new ErrorHandler(401, `Password incorreta!`)
        }
    }
    } catch (err){
        next(err)
    }
}

let addUser = async (req, res, next) => {
    const {nome, email, passwordHash, escola_id} = req.body
    let pontos = 0;
    try {
        if(!email.endsWith("@gmail.com")){
            throw new ErrorHandler(401, `Tem de utilizar um email!`)
        }
        let allUsers = await User.findAll({
            attributes : [`email`]
        })
        allEmails = []
        for (let user in allUsers){
            allEmails.push(allUsers[user].dataValues)
        }
        for(let i = 0; i < allEmails.length; i++){
            if(email == allEmails[i].email){
                throw new ErrorHandler(401, `Já existe uma conta associada a esse email!`)
            }
        }
        const nUserInfo = {escola_id, nome, email, passwordHash, pontos}
        await User.create(nUserInfo)
        res.status(201).json({
            msg: 'Utilizador criado com sucesso!'
        })    
    }
     catch (err) {
        next(err)
    }
}

module.exports = {
    getSessaoInscritasByUser,
    getAllUsers,
    checkUser,
    addUser,
    apagarUser,
}

