import Font from '../models/font.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import cloudinary from '../config/cloudinary.js';

// 1. Get all active fonts
export const listFonts = asyncHandler(async (req, res, next) => {
  const fonts = await Font.find({ isActive: true });
  res.status(200).json({
    status: 'success',
    results: fonts.length,
    data: {
      fonts,
    },
  });
});

// 2. Admin: Upload/Create font
export const createFont = asyncHandler(async (req, res, next) => {
  const { name, family, weight, style, licenseType } = req.body;

  if (!name || !family) {
    return next(new AppError('Font name and family are required.', 400));
  }

  if (!req.files || (!req.files.woff2 && !req.files.ttf)) {
    return next(new AppError('Please upload at least one font file (WOFF2 or TTF).', 400));
  }

  const fontData = {
    name,
    family,
    weight: weight || 'normal',
    style: style || 'normal',
    licenseType: licenseType || 'free',
  };

  // Upload WOFF2 if present
  if (req.files.woff2) {
    const file = req.files.woff2[0];
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'bhondu/fonts',
          resource_type: 'raw',
          public_id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_woff2.woff2`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    fontData.woff2Url = uploadResult.secure_url;
  }

  // Upload TTF if present
  if (req.files.ttf) {
    const file = req.files.ttf[0];
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'bhondu/fonts',
          resource_type: 'raw',
          public_id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ttf.ttf`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    fontData.ttfUrl = uploadResult.secure_url;
  }

  const font = await Font.create(fontData);

  res.status(201).json({
    status: 'success',
    data: {
      font,
    },
  });
});

// 3. Admin: Delete font
export const deleteFont = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const font = await Font.findById(id);
  if (!font) {
    return next(new AppError('Font not found.', 404));
  }

  font.isActive = false;
  await font.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
