import SavedDesign from '../models/saved-design.model.js';
import BlankTemplate from '../models/blank-template.model.js';
import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import cloudinary from '../config/cloudinary.js';

// 1. Initialize a new saved design
export const createDesign = asyncHandler(async (req, res, next) => {
  const { productId, templateId, name, selectedColor, selectedSize, views } = req.body;

  if (!productId) {
    return next(new AppError('Product ID is required to create a design.', 400));
  }

  // Create empty templates for views if not provided
  let initialViews = views;
  if (!initialViews || initialViews.length === 0) {
    // Attempt to pull views from BlankTemplate
    const template = await BlankTemplate.findById(templateId || productId);
    if (template) {
      initialViews = template.views.map(v => ({
        viewId: v.viewId,
        canvasJSON: JSON.stringify({ version: '5.3.0', objects: [] }),
        thumbnailUrl: '',
      }));
    } else {
      initialViews = [
        { viewId: 'front', canvasJSON: JSON.stringify({ version: '5.3.0', objects: [] }) },
        { viewId: 'back', canvasJSON: JSON.stringify({ version: '5.3.0', objects: [] }) }
      ];
    }
  }

  const design = await SavedDesign.create({
    userId: req.user._id,
    productId,
    templateId,
    name: name || 'My Custom Design',
    selectedColor,
    selectedSize,
    views: initialViews,
    status: 'draft',
  });

  res.status(201).json({
    status: 'success',
    data: {
      design,
    },
  });
});

// 2. Get single design details
export const getDesignById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const design = await SavedDesign.findById(id)
    .populate('productId', 'name price description category')
    .populate('templateId');

  if (!design) {
    return next(new AppError('Design not found.', 404));
  }

  // Security: only creator or admin can view draft designs
  if (design.userId.toString() !== req.user._id.toString() && !['Admin', 'Super Admin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to view this design.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      design,
    },
  });
});

// 3. Update design state (Save canvas & update thumbnails)
export const updateDesign = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, selectedColor, selectedSize, views, estimatedPrice } = req.body;

  const design = await SavedDesign.findById(id);

  if (!design) {
    return next(new AppError('Design not found.', 404));
  }

  // Authorization check
  if (design.userId.toString() !== req.user._id.toString() && !['Admin', 'Super Admin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to edit this design.', 403));
  }

  if (name) design.name = name;
  if (selectedColor) design.selectedColor = selectedColor;
  if (selectedSize) design.selectedSize = selectedSize;
  if (estimatedPrice !== undefined) design.estimatedPrice = estimatedPrice;

  if (views && Array.isArray(views)) {
    // Merge or update views
    views.forEach(updatedView => {
      const existingView = design.views.find(v => v.viewId === updatedView.viewId);
      if (existingView) {
        if (updatedView.canvasJSON !== undefined) existingView.canvasJSON = updatedView.canvasJSON;
        if (updatedView.thumbnailUrl !== undefined) existingView.thumbnailUrl = updatedView.thumbnailUrl;
      } else {
        design.views.push(updatedView);
      }
    });
  }

  await design.save();

  res.status(200).json({
    status: 'success',
    data: {
      design,
    },
  });
});

// 4. Get designs of currently logged-in user
export const getMyDesigns = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const designs = await SavedDesign.find({ userId: req.user._id, status: { $ne: 'archived' } })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('productId', 'name price images');

  const total = await SavedDesign.countDocuments({ userId: req.user._id, status: { $ne: 'archived' } });

  res.status(200).json({
    status: 'success',
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      designs,
    },
  });
});

// 5. Delete design (soft delete by setting status to archived)
export const deleteDesign = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const design = await SavedDesign.findById(id);

  if (!design) {
    return next(new AppError('Design not found.', 404));
  }

  if (design.userId.toString() !== req.user._id.toString() && !['Admin', 'Super Admin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to delete this design.', 403));
  }

  design.status = 'archived';
  await design.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// 6. Duplicate/Clone design
export const duplicateDesign = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const design = await SavedDesign.findById(id);

  if (!design) {
    return next(new AppError('Source design not found.', 404));
  }

  // Authorization check (only owner can duplicate)
  if (design.userId.toString() !== req.user._id.toString() && !['Admin', 'Super Admin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to duplicate this design.', 403));
  }

  const duplicatedViews = design.views.map(v => ({
    viewId: v.viewId,
    canvasJSON: v.canvasJSON,
    thumbnailUrl: v.thumbnailUrl,
  }));

  const newDesign = await SavedDesign.create({
    userId: req.user._id,
    productId: design.productId,
    templateId: design.templateId,
    name: `${design.name} (Copy)`,
    selectedColor: design.selectedColor,
    selectedSize: design.selectedSize,
    views: duplicatedViews,
    estimatedPrice: design.estimatedPrice,
    status: 'draft',
  });

  res.status(201).json({
    status: 'success',
    data: {
      design: newDesign,
    },
  });
});

// 7. Get high-res export signed URL (Cloudinary Private Deliveries)
export const getExportUrl = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { format = 'png' } = req.query;

  const design = await SavedDesign.findById(id);
  if (!design) {
    return next(new AppError('Design not found.', 404));
  }

  // Authentication & authorization
  if (design.userId.toString() !== req.user._id.toString() && !['Admin', 'Super Admin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to export this design.', 403));
  }

  // For MVP/Phase 1:
  // Return the main thumbnail URL or if there's a specific high-res rendering, we generate a signed URL.
  // Assuming high-res files are uploaded to Cloudinary as "private" type, we generate a private download link.
  // Check if we have publicId of the high-res file. In this case, we can use design's views[0].thumbnailUrl as fallback.
  const firstViewWithThumbnail = design.views.find(v => v.thumbnailUrl);
  const imageUrl = firstViewWithThumbnail ? firstViewWithThumbnail.thumbnailUrl : '';

  if (!imageUrl) {
    return next(new AppError('No design render exists to export. Please save your design first.', 400));
  }

  // Extract public ID from Cloudinary URL if possible
  // E.g., https://res.cloudinary.com/.../image/upload/v123456/bhondu/designs/xxx.png
  let publicId = '';
  const match = imageUrl.match(/\/v\d+\/([^\s]+)\.[a-z]+$/i);
  if (match && match[1]) {
    publicId = match[1];
  }

  let downloadUrl = imageUrl;
  if (publicId) {
    // Generate signed download URL (valid for 24h = 86400 seconds)
    try {
      downloadUrl = cloudinary.utils.private_download_url(publicId, format, {
        expires_at: Math.floor(Date.now() / 1000) + 86400,
        resource_type: 'image',
      });
    } catch (e) {
      // Fallback to direct URL if signing fails
      downloadUrl = imageUrl;
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      url: downloadUrl,
    },
  });
});
