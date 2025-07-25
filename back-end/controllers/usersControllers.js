const e = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models/connect.js');
require('dotenv').config(); 
const User = db.Utilizador; 
const InscritosSessao = db.InscritosSessao;
const bcrypt = require('bcrypt');


const { ErrorHandler } = require("../utils/error.js");

let getSessaoInscritasByUser = async (req, res, next) => {
    const user_id = req.params.id
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
        next(err);
    }
}

let apagarUser = async (req, res, next) => {
    const user_id = await req.params.user_id
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
            throw new ErrorHandler(400, 'Nao existe utilizador com esse email')
        } else {
            const user1 = Utilizador.dataValues
            if(user1.user_id == 1 ||user1.user_id == 2 || user1.user_id == 3 ){
                if(user1.passwordHash == passHash){
                    const secretKey = process.env.JWT_SECRET;
                const payload = {
                        user_id : user1.user_id,
                        perfil : user1.perfil
                        };
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                switch(user1.perfil){
                    case 'ALUNO':
                        res.status(200).json({
                            msg: 'Aluno logado',
                            token: token,
                            perfil: user1.perfil,
                        })
                    break;
                    case 'COORDENADOR' :
                        res.status(200).json({
                            msg: 'COORDENADOR logado',
                            token: token,
                            perfil:user1.perfil,
                        })
                    break;
                    case 'ADMIN': 
                        res.status(200).json({
                            msg: 'Admin logado',
                            token: token,
                            perfil:user1.perfil,
                        })
                    break;
                }
                } else {
                    throw new ErrorHandler(400, `Password incorreta!`)
                }
            }
            const isAMatch = await bcrypt.compare(passHash, user1.passwordHash);
            if(isAMatch){
                const secretKey = process.env.JWT_SECRET;
                const payload = {
                        user_id : user1.user_id,
                        perfil : user1.perfil
                        };
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                switch(user1.perfil){
                    case 'ALUNO':
                        res.status(200).json({
                            msg: 'Aluno logado',
                            token: token,
                            perfil: user1.perfil,
                        })
                    break;
                    case 'COORDENADOR' :
                        res.status(200).json({
                            msg: 'COORDENADOR logado',
                            token: token,
                            perfil:user1.perfil,
                        })
                    break;
                    case 'ADMIN': 
                        res.status(200).json({
                            msg: 'Admin logado',
                            token: token,
                            perfil:user1.perfil,
                        })
                    break;
            }
        } else {
            throw new ErrorHandler(400, `Password incorreta!`)
        }
    }
    } catch (err){
        next(err)
    }
}

const saltRounds = 10;
let addUser = async (req, res, next) => {
    class Utilizador{
        constructor(escola_id, nome, email, passwordHash, pontos){
            this.escola_id = escola_id;
            this.nome = nome;
            this.email = email;
            this.passwordHash = passwordHash;
            this.pontos = pontos;
        }
    }
    const {escola_id, nome, email, passwordHash} = req.body
    let pontos = 0;
    const nUserInfo = {escola_id, nome, email, passwordHash, pontos}
    try {
        const password = await bcrypt.hash(nUserInfo.passwordHash, saltRounds);
        const userN = new Utilizador(escola_id, nome, email, password, pontos)
        await User.create(userN)
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

