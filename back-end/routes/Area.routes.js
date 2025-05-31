const express = require('express')
const router = express.Router()

const AreaControllers = require('../controllers/areaTematicsControllers');

router.get('/', AreaControllers.getAllAreas);
router.get('/:area_id/ativities', AreaControllers.getAtivitiesByArea)
router.post('/', AreaControllers.addArea)
router.delete('/:id', AreaControllers.deleteArea)
router.get('/:id', AreaControllers.getSpecificArea)


module.exports = router;

