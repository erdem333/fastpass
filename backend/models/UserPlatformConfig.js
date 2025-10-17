import mongoose from 'mongoose';

const webhookConfigSubSchema = new mongoose.Schema(
  {
    presetName: {
      type: String,
      required: true
    },
    webhookUrl: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i
    },
    footerText: {
      type: String,
      required: true
    },
    logoUrl: String
  },
  { _id: false }
);

const userPlatformConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    platformId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform',
      required: true,
      index: true
    },
    eventIds: {
      type: [String],
      default: []
    },
    webhookConfig: webhookConfigSubSchema,
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Stelle sicher, dass user-platform Kombination eindeutig ist
userPlatformConfigSchema.index({ userId: 1, platformId: 1 }, { unique: true });

export default mongoose.model('UserPlatformConfig', userPlatformConfigSchema);
