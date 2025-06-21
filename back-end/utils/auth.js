const jwt = require('jsonwebtoken');
require('dotenv').config()

// Função para criar token JWT
const createToken = (user) => {
  return jwt.sign(
    { 
      user_id: user.user_id, 
      nome: user.nome, 
      email: user.email, 
      role: user.role || 'ADMIN' 
    }, 
    process.env.JWT_SECRET || 'test_secret_key',
    { expiresIn: '1h' }
  );
};

const authenticateTokenC = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ msg: 'Token inválido.' });
    }
    
    const perfil = req.user.perfil
    if(perfil == 'ALUNO'){
      return res.status(403).json({msg: `Acesso negado!`})
    }
    next();
  });
};

const authenticateTokenA = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err || !user) {
      return res.status(403).json({ msg: 'Token inválido.' });
    }
    
    const perfil = req.user.perfil
    if(perfil == 'ADMIN'){
      next();
    } else {
      return res.status(403).json({msg: `Acesso negado!`})
    }
  });
};

module.exports = {
  authenticateTokenC, 
  authenticateTokenA,
  createToken
};
