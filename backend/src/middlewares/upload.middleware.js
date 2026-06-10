import multer from 'multer';
import AppError from '../utils/appError.js';

// Use memory storage for direct Cloudinary stream upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('avatar'); // We expect 'avatar' key for uploads

export const uploadMultipleImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
}).array('images', 10); // We expect 'images' key for multiple uploads (max 10)

