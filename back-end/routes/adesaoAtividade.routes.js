const express = require('express')
const router = express.Router()

const adesaoAtividadeControllers = require('../controllers/adesaoAtividadeControllers')

router.get('/',adesaoAtividadeControllers.getAllAdesoes)
router.post('/', adesaoAtividadeControllers.addAdesao)
router.delete('/', adesaoAtividadeControllers.apagarAdesao)

module.exports = router