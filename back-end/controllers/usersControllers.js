const db = require('../models/connect.js'); 
const User = db.Utilizador; 
const Sessao = db.Sessao;


const { ErrorHandler } = require("../utils/error.js");

let getSessaoInscritasByUser = async (req, res, next) => {
    try {
        const user = await findUserByPK(req.params.id, {
            attributes: ['id', 'user', 'perfil']
        })
        if(!user){
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.params.id}.`)
        }
        const sessoes = await  user.getsessoes()

        user.dataValues.sessoes = sessoes; // add posts to the user object

        return res.status(200).json({
            data: user
        });
    } catch (err) {
        next(err);
    }
}

let getAllUsers = async (req, res, next) => {
    try {
        const Utilizadores = await User.findAll({
            attributes: ['user_id', 'escola_id', 'nome','email', 'passwordHash', 'perfil', 'dataRegisto', 'pontos']
        })
        if(!Utilizadores){
            throw new ErrorHandler(404, `Cannot find any USER with ID ${req.body.id}.`)
        }
        const plainUsers = Utilizadores.map(user => user.get({ plain: true }));

        return res.status(200).json({
            data: plainUsers
        });
    } catch (err) {
        next(err);
    }
}

let apagarUser = async (req, res, next) => {
    const {user_id} = req.body
    let dUser = {user_id}
    try {
        await User.destroy({
            where: {
                user_id : user_id
            }
        })
        if(!dUser){
            throw new ErrorHandler(404, `The user with the id ${req.body} doesn't exist`)
        }
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
    const {nome, email, passwordHash} = req.body
    const pontos = 0;
    const nUserInfo = {nome, email, passwordHash, pontos}
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

let inscricaoSessao = async (req, res, next) => {
    const {user_id, sessao_id} = req.body
    const nInfoIds = {user_id, sessao_id}
    let getSessaoId = nInfoIds.sessao_id;
    // let getUserId = nInfoIds.user_id;
    console.log(getSessaoId)
    try{
        const sessao2 = await Sessao.findByPk(getSessaoId)
        sessao2.vagas--;
        await sessao2.save();
        
        if(!sessao2){
            throw new ErrorHandler(404, 'sessao nao encontrada')
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getSessaoInscritasByUser,
    getAllUsers,
    checkUser,
    addUser,
    apagarUser,
    inscricaoSessao
}

