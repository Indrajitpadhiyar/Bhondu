import { Router } from 'express';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import UploadService from '../services/upload.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

const router = Router();

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

export default router;
