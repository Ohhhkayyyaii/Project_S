const OTP = require('../models/OTP');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');

// @desc    Send OTP for email verification
// @route   POST /api/otp/send
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists (for email verification)
    if (purpose === 'email_verification') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    // Check if user exists (for password reset)
    if (purpose === 'password_reset') {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found with this email' });
      }
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email and purpose
    await OTP.deleteMany({ email, purpose });

    // Save new OTP
    const otpDoc = new OTP({
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    await otpDoc.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, purpose);

    if (!emailResult.success) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({
      message: `OTP sent to ${email}`,
      purpose: purpose
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose = 'email_verification' } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find OTP document
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpDoc.isUsed = true;
    await otpDoc.save();

    // For email verification, mark user as verified
    if (purpose === 'email_verification') {
      const user = await User.findOne({ email });
      if (user) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    res.json({
      message: 'OTP verified successfully',
      purpose: purpose
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resend OTP
// @route   POST /api/otp/resend
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists (for password reset)
    if (purpose === 'password_reset') {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found with this email' });
      }
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete existing OTP
    await OTP.deleteMany({ email, purpose });

    // Save new OTP
    const otpDoc = new OTP({
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    await otpDoc.save();

    // Send new OTP email
    const emailResult = await sendOTPEmail(email, otp, purpose);

    if (!emailResult.success) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({
      message: `New OTP sent to ${email}`,
      purpose: purpose
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  resendOTP
};

