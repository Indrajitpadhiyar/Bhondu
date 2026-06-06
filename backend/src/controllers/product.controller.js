import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { products as seedData } from '../../../frontend/src/data/products.js';

export const seedProducts = asyncHandler(async (req, res, next) => {
  await Product.deleteMany({});
  const formatted = seedData.map(p => {
    const { id, originalPrice, ...rest } = p;
    return {
      ...rest,
      price: originalPrice || p.price,
      salePrice: originalPrice ? p.price : null,
      discount: p.discount || 0,
      stock: p.stock || 20,
      rating: p.rating || 5.0,
      reviewsCount: p.reviewsCount || 0
    };
  });
  const inserted = await Product.insertMany(formatted);
  res.status(200).json({
    status: 'success',
    message: `${inserted.length} products seeded successfully!`,
  });
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const { gender, category, subcategory, search } = req.query;
  const filter = {};

  if (gender) filter.gender = gender;
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

export const getProductDetails = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
