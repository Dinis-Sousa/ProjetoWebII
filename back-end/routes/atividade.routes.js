const express = require('express');
const router = express.Router();

const atividadeController = require('../controllers/atividadeControllers.js');
const adesaoAtividadeControllers = require('../controllers/adesaoAtividadeControllers')

router.post('/:atividade_id/schools/:escola_id', adesaoAtividadeControllers.addAdesao)
router.get('/:atividade_id/schools/:escola_id', adesaoAtividadeControllers.getAllAdesoes)
router.get('/', atividadeController.getAllAtividades); 
router.post('/', atividadeController.addAtividade);
router.patch('/', atividadeController.alterarEstado)
router.delete('/', atividadeController.apagarAtividade)

module.exports = router;