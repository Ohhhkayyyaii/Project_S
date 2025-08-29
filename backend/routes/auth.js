const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');

// @route   POST /api/auth/register
router.post('/register', authLimiter, validateRegister, register);

// @route   POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

// @route   GET /api/auth/me
router.get('/me', auth, me);

module.exports = router;
