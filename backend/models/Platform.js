import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    category: {
      type: String,
      enum: ['ticketing', 'sports'],
      required: true
    },
    country: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    icon: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index für effiziente Abfragen
platformSchema.index({ category: 1, country: 1 });

export default mongoose.model('Platform', platformSchema);
