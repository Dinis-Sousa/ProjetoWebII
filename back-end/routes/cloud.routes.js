const upload = require('../utils/multer.js');
const express = require('express');
const router = express.Router()

router.post('/upload', upload.single('imagem'), )

