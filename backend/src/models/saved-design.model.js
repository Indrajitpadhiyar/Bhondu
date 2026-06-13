import mongoose from 'mongoose';

const savedDesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlankTemplate',
  },
  name: {
    type: String,
    default: 'My Custom T-Shirt',
  },
  status: {
    type: String,
    enum: ['draft', 'ordered', 'archived'],
    default: 'draft',
  },
  selectedColor: {
    type: String,
  },
  selectedSize: {
    type: String,
  },
  views: [{
    viewId: {
      type: String,
      enum: ['front', 'back', 'left-sleeve', 'right-sleeve', 'collar'],
      required: true,
    },
    canvasJSON: {
      type: String, // Stringified Fabric.js JSON state
      required: true,
    },
    thumbnailUrl: {
      type: String,
    }
  }],
  estimatedPrice: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const SavedDesign = mongoose.model('SavedDesign', savedDesignSchema);
export default SavedDesign;
