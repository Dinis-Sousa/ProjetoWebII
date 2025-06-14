const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersControllers.js');
const inscricaoVoluntariadoControllers = require('../controllers/inscricaoVoluntariado.controllers.js')


router.get('/:user_id/sessions/:sessao_id', inscricaoVoluntariadoControllers.getTheRegistration);
router.put('/:user_id/sessions/:sessao_id', inscricaoVoluntariadoControllers.inscrever);
router.patch('/:user_id/sessions/:sessao_id', inscricaoVoluntariadoControllers.marcarPresenca);
router.delete('/:user_id/sessions/:sessao_id', inscricaoVoluntariadoControllers.removerInscricao)
router.get('/:id/sessions', usersController.getSessaoInscritasByUser); // get all sessoes from a user
router.get('/', usersController.getAllUsers);
router.post('/login', usersController.checkUser);
router.post('/', usersController.addUser);
router.delete('/:user_id', usersController.apagarUser);                                        

module.exports = router;