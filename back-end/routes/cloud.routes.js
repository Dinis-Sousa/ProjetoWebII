const upload = require('../utils/multer.js');
const express = require('express');
const router = express.Router()

const CloudControllers = require('../controllers/CloudinaryControllers.js');

router.post('/upload', CloudControllers.uploadImg);

