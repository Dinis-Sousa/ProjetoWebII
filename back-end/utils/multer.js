// middleware/multer.js
import multer from 'multer';
import { memoryStorage } from 'multer';

const storage = memoryStorage();

const upload = multer({ storage });

export default upload;
