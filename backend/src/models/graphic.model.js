import mongoose from 'mongoose';

const graphicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Graphic name is required'],
  },
  tags: [String],
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  svgUrl: {
    type: String,
    required: [true, 'SVG URL is required'],
  },
  thumbnailUrl: {
    type: String,
  },
  previewUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Graphic = mongoose.model('Graphic', graphicSchema);
export default Graphic;
