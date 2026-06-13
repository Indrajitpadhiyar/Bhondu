import BlankTemplate from '../models/blank-template.model.js';
import PrintArea from '../models/print-area.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// 1. Create a blank template
export const createTemplate = asyncHandler(async (req, res, next) => {
  const { productId, name, views } = req.body;

  if (!productId || !name || !views || !Array.isArray(views)) {
    return next(new AppError('Please provide productId, name, and views array.', 400));
  }

  const template = await BlankTemplate.create({
    productId,
    name,
    views,
  });

  res.status(201).json({
    status: 'success',
    data: {
      template,
    },
  });
});

// 2. Get templates by productId
export const getTemplatesByProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const templates = await BlankTemplate.find({ productId, isActive: true });

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: {
      templates,
    },
  });
});

// 3. Get single template detail (includes related print areas)
export const getTemplateById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const template = await BlankTemplate.findById(id);
  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  const printAreas = await PrintArea.find({ templateId: id });

  res.status(200).json({
    status: 'success',
    data: {
      template,
      printAreas,
    },
  });
});

// 4. Update template
export const updateTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const template = await BlankTemplate.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      template,
    },
  });
});

// 5. Delete template
export const deleteTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const template = await BlankTemplate.findByIdAndUpdate(id, { isActive: false }, {
    new: true,
  });

  if (!template) {
    return next(new AppError('Template not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// 6. Define/Update print area for a view
export const definePrintArea = asyncHandler(async (req, res, next) => {
  const { templateId, viewId, x, y, width, height, safeMargin, unit } = req.body;

  if (!templateId || !viewId || x === undefined || y === undefined || !width || !height) {
    return next(new AppError('Please provide templateId, viewId, x, y, width, and height.', 400));
  }

  // Find existing print area or update/create
  let printArea = await PrintArea.findOne({ templateId, viewId });

  if (printArea) {
    printArea.x = x;
    printArea.y = y;
    printArea.width = width;
    printArea.height = height;
    printArea.safeMargin = safeMargin ?? printArea.safeMargin;
    printArea.unit = unit ?? printArea.unit;
    await printArea.save();
  } else {
    printArea = await PrintArea.create({
      templateId,
      viewId,
      x,
      y,
      width,
      height,
      safeMargin: safeMargin ?? 10,
      unit: unit ?? 'px',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      printArea,
    },
  });
});

// 7. Get print area for template view
export const getPrintAreaByView = asyncHandler(async (req, res, next) => {
  const { templateId, viewId } = req.params;

  const printArea = await PrintArea.findOne({ templateId, viewId });

  if (!printArea) {
    return next(new AppError('Print area not defined for this view', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      printArea,
    },
  });
});
