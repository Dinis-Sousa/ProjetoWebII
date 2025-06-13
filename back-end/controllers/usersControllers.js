const e = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models/connect.js'); 
const User = db.Utilizador; 
const School = db.School;
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
        const Utilizadores = await User.findAll({
            attributes: ['user_id', 'escola_id', 'nome','email', 'passwordHash', 'perfil', 'dataRegisto', 'pontos']
        })
        if(!Utilizadores){
            throw new ErrorHandler(404, `There are no users!`)
        }
        const plainUsers = Utilizadores.map(user => user.get({ plain: true }));
        console.log(plainUsers)

        return res.status(200).json({
            data: plainUsers
        });
    } catch (err) {
        console.error(err);
    }
}

let apagarUser = async (req, res, next) => {
    const user_id = req.body
    try {
        await User.destroy({
            where: {
                user_id : user_id
            }
        })
        res.status(204).json({
            msg: 'UTLIZADOR APAGADO COM SUCESSO'
        })
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
            throw new ErrorHandler(404, 'Nao existe utilizador com esse email')
        } else {
            const user1 = Utilizador.dataValues
            if(user1.passwordHash == passHash){
                const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
                const payload = {
                        email: tEmail,
                        password: passHash
                        };
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
            console.log('JWT:', token);
                switch(user1.perfil){
                    case 'ALUNO':
                        res.status(200).json({
                            msg: 'Aluno logado'
                        })
                    break;
                    case 'COLABORADOR' :
                        res.status(200).json({
                            msg: 'Colaborador logado'
                        })
                    break;
                    case 'ADMIN': 
                        res.status(200).json({
                            msg: 'Admin logado'
                        })
                    break;
            }
        } else {
            throw new ErrorHandler(404, `Password incorreta!`)
        }
    }
    } catch (err){
        next(err)
    }
}

let addUser = async (req, res, next) => {
    const {nome, email, passwordHash, escola} = req.body
    const myInfoObj = {nome, email, passwordHash, escola};
    console.log(myInfoObj.nome)
    mySchoolName = myInfoObj.escola
    try {
        const schoolID = await School.findAll({
            attributes: ['escola_id'],
            where : {
                nome : mySchoolName}
        })
        if(!schoolID){
            throw new ErrorHandler(404, `The school you wrote isn't in our database`)
        }
        let escola_id = schoolID[0].dataValues.escola_id
        const pontos = 0;
        const nUserInfo = {escola_id, nome, email, passwordHash, pontos}
        console.log(nUserInfo)
        try {
            await User.create(nUserInfo)
            res.status(201).json({
                msg: 'Utilizador criado com sucesso!'
            })
        } catch (err) {
            next(err)
        }
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

