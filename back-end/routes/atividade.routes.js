const express = require('express');
const router = express.Router();

const atividadeController = require('../controllers/atividadeControllers.js');

router.get('/', atividadeController.getAllAtividades); 
router.post('/', atividadeController.addAtividade);
router.patch('/', atividadeController.alterarEstado)
router.delete('/', atividadeController.apagarAtividade)

module.exports = router;