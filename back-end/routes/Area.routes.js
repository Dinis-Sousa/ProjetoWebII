const express = require('express')
const router = express.Router()

const AreaControllers = require('../controllers/areaTematicsControllers');
const areaTematics_models = require('../models/areaTematics_models');

router.get('/', AreaControllers.getAllAreas);
router.get('/:area_id/ativities', AreaControllers.getAtivitiesByArea)
router.post('/', AreaControllers.addArea)
router.delete('/:area_id', AreaControllers.deleteArea)
router.get('/:area_id', AreaControllers.getSpecificArea)
router.get('/nome/:nome', AreaControllers.getAreaIdByName)


module.exports = router;

