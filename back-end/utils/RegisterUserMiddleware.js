
let RegisterMiddleware = async (req, res, next) => {
    const email = req.body.email;
    const db = require('../models/connect');
    const Utilizador = db.Utilizador
   try{
       if(!email || typeof email !== 'string' || !email.endsWith("@gmail.com")){
           return res.status(400).json({msg : `Tem de utilizar um email!`})
       }
       const existingUser = await Utilizador.findOne({
           attributes: ['email'],
            where: { email : email }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Já existe uma conta associada a esse email!" });
        }
       next()
   } catch(err){
        console.error('Erro ao validar o email inserido:', err);
        return res.status(500).json({
            error: 'Erro interno do servidor ao validar o email inserido.'
        });
   }  
}

module.exports = RegisterMiddleware

