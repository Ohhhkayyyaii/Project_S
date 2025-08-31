const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController');
const { body } = require('express-validator');
const { otpLimiter } = require('../middleware/rateLimit');
const { handleValidationErrors } = require('../middleware/validation');

// Validation middleware
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

const validateOTP = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  handleValidationErrors
];

// @route   POST /api/otp/send
router.post('/send', otpLimiter, validateEmail, sendOTP);

// @route   POST /api/otp/verify
router.post('/verify', otpLimiter, validateOTP, verifyOTP);

// @route   POST /api/otp/resend
router.post('/resend', otpLimiter, validateEmail, resendOTP);

module.exports = router;
