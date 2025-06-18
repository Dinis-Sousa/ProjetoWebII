const cloudinary = require('../models/cloudinaryConfig.js')

let uploadImg = async (req, res, next) => {
    try {
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'meu_app'
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    next(err)
  }
};