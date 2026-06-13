import Graphic from '../models/graphic.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import cloudinary from '../config/cloudinary.js';

// 1. List clipart graphics
export const listGraphics = asyncHandler(async (req, res, next) => {
  const { category, search } = req.query;

  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const graphics = await Graphic.find(query);

  res.status(200).json({
    status: 'success',
    results: graphics.length,
    data: {
      graphics,
    },
  });
});

// 2. Get unique categories
export const listCategories = asyncHandler(async (req, res, next) => {
  const categories = await Graphic.distinct('category', { isActive: true });

  res.status(200).json({
    status: 'success',
    data: {
      categories,
    },
  });
});

// 3. Admin: Upload a clipart graphic (SVG)
export const createGraphic = asyncHandler(async (req, res, next) => {
  const { name, category, tags } = req.body;

  if (!name || !category) {
    return next(new AppError('Graphic name and category are required.', 400));
  }

  if (!req.file) {
    return next(new AppError('Please upload an SVG clipart file.', 400));
  }

  // Upload SVG to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'bhondu/graphics',
        resource_type: 'image',
        public_id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_clipart`,
        format: 'svg',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];

  const graphic = await Graphic.create({
    name,
    category,
    tags: parsedTags,
    svgUrl: uploadResult.secure_url,
    thumbnailUrl: uploadResult.secure_url,
    previewUrl: uploadResult.secure_url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      graphic,
    },
  });
});

// 4. Admin: Delete graphic
export const deleteGraphic = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const graphic = await Graphic.findById(id);
  if (!graphic) {
    return next(new AppError('Graphic not found.', 404));
  }

  graphic.isActive = false;
  await graphic.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
