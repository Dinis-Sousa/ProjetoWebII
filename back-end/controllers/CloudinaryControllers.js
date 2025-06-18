const cloudinary = require('../models/cloudinaryConfig.js')

let uploadImg = async (req, res, next) => {
    try {
        // Verifica se o ficheiro foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
    }
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'meu_app'
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    next(err)
  }
};

module.exports = {uploadImg};