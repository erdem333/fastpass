import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    username: {
      type: String,
      required: true
    },
    email: String,
    avatar: String,
    discriminator: String,
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
