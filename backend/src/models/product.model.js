import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  salePrice: {
    type: Number,
    default: null,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Tournament Wear',
  },
  subcategory: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['man', 'women', 'unisex'],
    default: 'man',
  },
  stock: {
    type: Number,
    default: 20,
  },
  sizes: [String],
  colors: [String],
  tags: [String],
  images: {
    type: [String],
    default: [],
  },
  shippingCost: {
    type: Number,
    default: 99,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
