const express = require('express')
const router = express.Router()

const schoolControllers = require('../controllers/schoolControllers')

router.get('/', schoolControllers.getAllSchool)
router.post('/', schoolControllers.addSchool)

module.exports = router;
