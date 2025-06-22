const express = require('express')
const router = express.Router();
const {authenticateTokenA} = require('../utils/auth.js');

const AreaControllers = require('../controllers/areaTematicsControllers');

router.get('/', AreaControllers.getAllAreas);
router.get('/:area_id/ativities', AreaControllers.getAtivitiesByArea)
router.post('/', authenticateTokenA,  AreaControllers.addArea)
router.delete('/:area_id', authenticateTokenA, AreaControllers.deleteArea)
router.get('/:area_id', AreaControllers.getSpecificArea)


module.exports = router;

