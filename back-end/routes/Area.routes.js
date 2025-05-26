const express = require('express')
const router = express.Router()

const AreaControllers = require('../controllers/areaTematicsControllers');

router.get('/', AreaControllers.getAllAreas);


module.exports = router;

