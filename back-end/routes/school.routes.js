const express = require('express')
const router = express.Router();
const {authenticateTokenA} = require('../utils/auth.js');
const AddSchoolMiddleware = require('../utils/ValidateAddSchoolMiddleware.js');

const schoolControllers = require('../controllers/schoolControllers')

router.get('/', schoolControllers.getAllSchool)
router.post('/', authenticateTokenA, AddSchoolMiddleware, schoolControllers.addSchool)
router.delete('/:escola_id', authenticateTokenA,  schoolControllers.apagarSchool)

module.exports = router;