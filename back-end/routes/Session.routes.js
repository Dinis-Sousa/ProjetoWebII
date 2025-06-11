const express = require('express')
const router = express.Router()

const SessaoControllers = require('../controllers/sessaoControllers')
const inscricaoVoluntariadoControllers = require('../controllers/inscricaoVoluntariado.controllers')

router.get('/', SessaoControllers.getAllSessions)
router.post('/', SessaoControllers.addSessao)
router.delete('/:id', SessaoControllers.apagarSessao)
router.get('/sessao', SessaoControllers.getSessionByDate)
router.get('/:sessao_id/users', inscricaoVoluntariadoControllers.listOfUsersBySession);

module.exports = router