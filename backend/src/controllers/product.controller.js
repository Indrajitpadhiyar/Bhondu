import Product from '../models/product.model.js';
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
