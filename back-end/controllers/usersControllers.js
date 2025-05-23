const db = require('../models/connect.js'); 
const User = db.Utilizador; 


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
            attributes: ['user_id', 'escola_id', 'nome','email', 'passwordHssh', 'perfil', 'dataRegisto', 'pontos']
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

module.exports = {
    getSessaoInscritasByUser,
    getAllUsers,
}

