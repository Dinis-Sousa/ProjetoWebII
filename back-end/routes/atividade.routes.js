const express = require('express');
const router = express.Router();

const atividadeController = require('../controllers/atividadeControllers.js');

router.get('/', atividadeController.getAllAtividades); // get all sessoes from a user
router.post('/', atividadeController.addAtividade); // adiciona uma atividade

module.exports = router;