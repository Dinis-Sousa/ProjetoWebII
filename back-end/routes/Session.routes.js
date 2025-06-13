const express = require('express')
require('dotenv').config(); 
const router = express.Router()
const authenticateToken = require('../utils/auth.js');

const SessaoControllers = require('../controllers/sessaoControllers')
const inscricaoVoluntariadoControllers = require('../controllers/inscricaoVoluntariado.controllers')

router.get('/', SessaoControllers.getAllSessions)
router.post('/', SessaoControllers.addSessao)
router.delete('/:id', authenticateToken, SessaoControllers.apagarSessao)
router.get('/sessao', SessaoControllers.getSessionByDate)
router.get('/:sessao_id/users', inscricaoVoluntariadoControllers.listOfUsersBySession);

module.exports = router