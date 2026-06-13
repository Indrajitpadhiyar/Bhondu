import { Router } from 'express';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import UploadService from '../services/upload.service.js';
import UploadedAsset from '../models/uploaded-asset.model.js';
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

// ==========================================
// UPLOAD ENDPOINTS
// ==========================================

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
      UploadService.uploadImageBuffer(file.buffer, 'products', file.originalname, req.user._id)
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.url);

    res.status(200).json({
      status: 'success',
      data: {
        urls,
        assets: results.map(r => r.asset).filter(Boolean)
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
      UploadService.uploadImageBuffer(file.buffer, 'reviews', file.originalname, req.user._id)
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.url);

    res.status(200).json({
      status: 'success',
      data: {
        urls,
        assets: results.map(r => r.asset).filter(Boolean)
      },
    });
  })
);

// ==========================================
// ADMIN ASSETS & STATS ENDPOINTS
// ==========================================

// GET /api/v1/upload/assets - List all uploaded assets with pagination
router.get(
  '/assets',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.folder) {
      query.folder = req.query.folder;
    }
    if (req.query.format) {
      query.format = req.query.format;
    }
    if (req.query.search) {
      query.originalName = { $regex: req.query.search, $options: 'i' };
    }

    const [assets, total] = await Promise.all([
      UploadedAsset.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email'),
      UploadedAsset.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      results: assets.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        assets
      }
    });
  })
);

// GET /api/v1/upload/assets/stats - Aggregate compression statistics
router.get(
  '/assets/stats',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  asyncHandler(async (req, res) => {
    const result = await UploadedAsset.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalOriginalSize: { $sum: '$originalSize' },
          totalOptimizedSize: { $sum: '$optimizedSize' },
          avgCompression: { $avg: '$compressionRatio' }
        }
      }
    ]);

    const stats = result[0] || {
      totalFiles: 0,
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      avgCompression: 0
    };

    const bandwidthSaved = Math.max(0, stats.totalOriginalSize - stats.totalOptimizedSize);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalFiles: stats.totalFiles,
          totalOriginalSize: stats.totalOriginalSize,
          totalOptimizedSize: stats.totalOptimizedSize,
          avgCompression: Math.round(stats.avgCompression * 10) / 10,
          bandwidthSaved
        }
      }
    });
  })
);

// DELETE /api/v1/upload/assets/:id - Delete asset from DB and Cloudinary
router.delete(
  '/assets/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  asyncHandler(async (req, res, next) => {
    const asset = await UploadedAsset.findById(req.params.id);
    if (!asset) {
      return next(new AppError('No asset found with that ID.', 404));
    }

    // 1. Delete from Cloudinary
    await UploadService.deleteImage(asset.publicId);

    // 2. Delete from DB
    await UploadedAsset.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  })
);

export default router;
