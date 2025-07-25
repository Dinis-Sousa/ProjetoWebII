const express = require('express');
const router = express.Router();
const {authenticateTokenC} = require('../utils/auth.js');
const validateDateMiddleware = require('../utils/validateDateMiddleware.js')

const atividadeController = require('../controllers/atividadeControllers.js');

router.get('/:id/sessions', atividadeController.getSessionsByAtivity)
router.get('/', atividadeController.getAllAtividades); 
router.post('/', authenticateTokenC,  validateDateMiddleware,  atividadeController.addAtividade);
router.get('/:atividade_id', atividadeController.getAtivityNameById);
router.patch('/:atividade_id', authenticateTokenC,  atividadeController.alterarEstado);
router.delete('/:id', authenticateTokenC,  atividadeController.apagarAtividade);

module.exports = router;