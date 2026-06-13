import mongoose from 'mongoose';

const blankTemplateSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  name: {
    type: String,
    required: true,
  },
  views: [{
    viewId: {
      type: String,
      enum: ['front', 'back', 'left-sleeve', 'right-sleeve', 'collar'],
      required: true,
    },
    mockupImageUrl: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 800,
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const BlankTemplate = mongoose.model('BlankTemplate', blankTemplateSchema);
export default BlankTemplate;
