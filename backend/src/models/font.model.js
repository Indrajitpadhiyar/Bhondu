import mongoose from 'mongoose';

const fontSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Font name is required'],
    unique: true,
  },
  family: {
    type: String,
    required: [true, 'Font family name is required'],
  },
  weight: {
    type: String,
    default: 'normal',
  },
  style: {
    type: String,
    default: 'normal',
  },
  woff2Url: {
    type: String,
  },
  ttfUrl: {
    type: String,
  },
  previewImageUrl: {
    type: String,
  },
  licenseType: {
    type: String,
    enum: ['free', 'paid', 'custom'],
    default: 'free',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Font = mongoose.model('Font', fontSchema);
export default Font;
