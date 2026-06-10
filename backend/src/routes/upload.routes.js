import { Router } from 'express';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import UploadService from '../services/upload.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import multer from 'multer';

const router = Router();

// Multer config for review images (max 5 files, 5MB each)
const reviewImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
}).array('images', 5); // max 5 review images

// Admin-only: Upload multiple product images
router.post(
  '/multiple',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  uploadMultipleImages,
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images provided for upload.', 400));
    }

    const uploadPromises = req.files.map(file =>
      UploadService.uploadImageBuffer(file.buffer, 'products')
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.url);

    res.status(200).json({
      status: 'success',
      data: {
        urls,
      },
    });
  })
);

// Any authenticated user: Upload review images
router.post(
  '/review-images',
  authenticateUser,
  reviewImageUpload,
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images provided for upload.', 400));
    }

    const uploadPromises = req.files.map(file =>
      UploadService.uploadImageBuffer(file.buffer, 'reviews')
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.url);

    res.status(200).json({
      status: 'success',
      data: {
        urls,
      },
    });
  })
);

export default router;

