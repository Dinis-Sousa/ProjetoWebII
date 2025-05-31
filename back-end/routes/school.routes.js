const express = require('express')
const router = express.Router()

const schoolControllers = require('../controllers/schoolControllers')
const adesaoAtividadeControllers = require('../controllers/adesaoAtividadeControllers')

router.get('/:escola_id/ativities', adesaoAtividadeControllers.ativitiesBySchool)
router.get('/', schoolControllers.getAllSchool)
router.post('/', schoolControllers.addSchool)
router.delete('/:id', schoolControllers.apagarSchool)

module.exports = router;
