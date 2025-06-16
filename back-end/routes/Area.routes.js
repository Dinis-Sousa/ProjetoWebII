const express = require('express')
const router = express.Router();
const {authenticateTokenC} = require('../utils/auth.js');

const AreaControllers = require('../controllers/areaTematicsControllers');

router.get('/', AreaControllers.getAllAreas);
router.get('/:area_id/ativities', AreaControllers.getAtivitiesByArea)
router.post('/', authenticateTokenC,  AreaControllers.addArea)
router.delete('/:area_id', authenticateTokenC, AreaControllers.deleteArea)
router.get('/:area_id', AreaControllers.getSpecificArea)


module.exports = router;

