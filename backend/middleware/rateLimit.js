const rateLimit = require('express-rate-limit');

// Rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many authentication attempts, please try again after 15 minutes'
    });
  }
});

// Rate limit for project rating
const ratingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 rating requests per hour
  message: {
    message: 'Too many rating attempts, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many rating attempts, please try again after 1 hour'
    });
  }
});

// Rate limit for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 8 OTP actions per window
  message: {
    message: 'Too many OTP requests, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many OTP requests, please try again after 15 minutes'
    });
  }
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again after 15 minutes'
    });
  }
});

module.exports = {
  authLimiter,
  ratingLimiter,
  otpLimiter,
  apiLimiter
};
