const express = require('express')
require('dotenv').config(); 
const router = express.Router()
const {authenticateTokenC} = require('../utils/auth.js');
const validadeDateAndHour = require('../utils/ValidadeDateAndHourMiddleware.js');

const SessaoControllers = require('../controllers/sessaoControllers')
const inscricaoVoluntariadoControllers = require('../controllers/inscricaoVoluntariado.controllers')

router.get('/', SessaoControllers.getAllSessions)
router.post('/', authenticateTokenC, validadeDateAndHour,  SessaoControllers.addSessao)
router.delete('/:sessao_id', authenticateTokenC, SessaoControllers.apagarSessao)
router.get('/sessao', SessaoControllers.getSessionByDate)
router.get('/:sessao_id/users', inscricaoVoluntariadoControllers.listOfUsersBySession);

module.exports = router