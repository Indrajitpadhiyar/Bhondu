import mongoose from 'mongoose';

const printAreaSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlankTemplate',
    required: [true, 'Template ID is required'],
  },
  viewId: {
    type: String,
    enum: ['front', 'back', 'left-sleeve', 'right-sleeve', 'collar'],
    required: true,
  },
  x: {
    type: Number, // Offset left in px
    required: true,
  },
  y: {
    type: Number, // Offset top in px
    required: true,
  },
  width: {
    type: Number, // Width in px
    required: true,
  },
  height: {
    type: Number, // Height in px
    required: true,
  },
  safeMargin: {
    type: Number,
    default: 10,
  },
  unit: {
    type: String,
    enum: ['px', 'mm', 'percentage'],
    default: 'px',
  },
  maxPrintWidth: Number,
  maxPrintHeight: Number,
}, {
  timestamps: true,
});

const PrintArea = mongoose.model('PrintArea', printAreaSchema);
export default PrintArea;
