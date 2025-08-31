const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300 // 5 minutes
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  purpose: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    default: 'email_verification'
  }
}, { timestamps: true });

// Index for faster queries
otpSchema.index({ email: 1, purpose: 1 });

module.exports = mongoose.model('OTP', otpSchema);

