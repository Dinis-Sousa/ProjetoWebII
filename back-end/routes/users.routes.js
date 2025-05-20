const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersControllers.js');

router.get('/:id/sessoes', usersController.getSessaoInscritasByUser); // get all sessoes from a user

module.exports = router;