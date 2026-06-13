import mongoose from 'mongoose';

const uploadedAssetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  originalSize: {
    type: Number, // in bytes
    required: true,
  },
  originalWidth: {
    type: Number,
    required: true,
  },
  originalHeight: {
    type: Number,
    required: true,
  },
  optimizedUrl: {
    type: String,
    required: true,
  },
  optimizedSize: {
    type: Number, // in bytes
    required: true,
  },
  optimizedWidth: {
    type: Number,
    required: true,
  },
  optimizedHeight: {
    type: Number,
    required: true,
  },
  format: {
    type: String, // original or target format (e.g. webp, avif)
    required: true,
  },
  compressionRatio: {
    type: Number, // percentage saved (e.g. 74 for 74% compression)
    default: 0,
  },
  optimizationStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  thumbnailUrl: {
    type: String,
  },
  mediumUrl: {
    type: String,
  },
  largeUrl: {
    type: String,
  },
  zoomUrl: {
    type: String,
  },
  publicId: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    default: 'general',
  }
}, {
  timestamps: true,
});

const UploadedAsset = mongoose.model('UploadedAsset', uploadedAssetSchema);

export default UploadedAsset;
