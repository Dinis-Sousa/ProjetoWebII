const express = require('express')
const router = express.Router()

const inscricaoVoluntariadoControllers = require('../controllers/inscricaoVoluntariado.controllers')

router.get('/', inscricaoVoluntariadoControllers.gettAllInscricoes)
router.post('/', inscricaoVoluntariadoControllers.inscrever)
router.delete('/', inscricaoVoluntariadoControllers.removerInscricao)
router.patch('/', inscricaoVoluntariadoControllers.marcarPresenca)

module.exports = router

