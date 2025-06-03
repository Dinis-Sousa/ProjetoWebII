const express = require('express');
const router = express.Router();

const atividadeController = require('../controllers/atividadeControllers.js');
const adesaoAtividadeControllers = require('../controllers/adesaoAtividadeControllers')

router.delete('/:atividade_id/schools/:escola_id', adesaoAtividadeControllers.apagarAdesao)
router.get('/:atividade_id/schools', adesaoAtividadeControllers.escolasPorAtividade)
router.put('/:atividade_id/schools/:escola_id', adesaoAtividadeControllers.addAdesao)
router.get('/schools', adesaoAtividadeControllers.getAllAdesoes)
router.get('/:id/sessions', atividadeController.getSessionsByAtivity)
router.get('/', atividadeController.getAllAtividades); 
router.post('/', atividadeController.addAtividade);
router.patch('/:atividade_id', atividadeController.alterarEstado)
router.delete('/', atividadeController.apagarAtividade)

module.exports = router;