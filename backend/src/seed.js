import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Local self-contained product seed data
const products = [
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
