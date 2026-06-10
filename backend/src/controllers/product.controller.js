import Product from '../models/product.model.js';
import Review from '../models/review.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
// Local self-contained product seed data
const seedData = [
  {
    name: "Aether Pro Esports Jersey",
    price: 89,
    originalPrice: 119,
    discount: 25,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Tournament Wear",
    subcategory: "Esports Jerseys",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Engineered for elite performance. The Aether Pro Esports Jersey blends ultra-breathable moisture-wicking technology."
  },
  {
    name: "Aegis Pro Women Jersey",
    price: 89,
    originalPrice: 119,
    discount: 25,
    rating: 4.8,
    reviewsCount: 31,
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Tournament Wear",
    subcategory: "Women Gaming Jerseys",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#111111", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "High-performance women's fit gaming jersey featuring a tapered waistline and gold foil logo print accents."
  }
];

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

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

// ============= REVIEW CONTROLLERS =============

// Helper: Recalculate product rating & reviewsCount from Review collection
const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewsCount: 0,
    });
  }
};

export const createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, images } = req.body;
  const productId = req.params.id;

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) {
    return next(new AppError('You have already reviewed this product.', 400));
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
    images: images || [],
  });

  // Recalculate product stats
  await recalculateProductRating(product._id);

  // Populate user info before sending response
  await review.populate('user', 'name avatar');

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

export const getProductReviews = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const mongoose = (await import('mongoose')).default;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: productId }),
  ]);

  // Get star distribution
  const distribution = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach(d => {
    starCounts[d._id] = d.count;
  });

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
      starCounts,
    },
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id: productId, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Only author or admin can delete
  const isAuthor = review.user.toString() === req.user._id.toString();
  const isAdmin = ['Admin', 'Super Admin'].includes(req.user.role);
  if (!isAuthor && !isAdmin) {
    return next(new AppError('You do not have permission to delete this review.', 403));
  }

  await Review.findByIdAndDelete(reviewId);

  // Recalculate product stats
  const product = await Product.findById(productId);
  if (product) {
    await recalculateProductRating(product._id);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

