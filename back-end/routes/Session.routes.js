const express = require('express')
const router = express.Router()

const SessaoControllers = require('../controllers/sessaoControllers')

router.get('/', SessaoControllers.getAllSessions)
router.post('/', SessaoControllers.addSessao)
router.delete('/:id', SessaoControllers.apagarSessao)
router.get('/sessao', SessaoControllers.getSessionByDate)

module.exports = router