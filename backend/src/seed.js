import mongoose from 'mongoose';
import dotenv from 'dotenv';

import products from './data/products.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bmunnambbs_db_user:SsF1CzOKyHeL8Cr4@bhondu.uq7dsr0.mongodb.net/';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  discount: { type: Number, default: 0 },
  description: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  gender: { type: String, enum: ['man', 'women', 'unisex'], default: 'man' },
  stock: { type: Number, default: 20 },
  sizes: [String],
  colors: [String],
  tags: [String],
  images: { type: [String], default: [] },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.');

  console.log('Deleting existing products...');
  await Product.deleteMany({});
  console.log('Existing products deleted.');

  const formatted = products.map(p => {
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

  console.log(`Inserting ${formatted.length} products...`);
  await Product.insertMany(formatted);
  console.log('Products successfully seeded!');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
