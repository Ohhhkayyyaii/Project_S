const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const otpRoutes = require('./otp');

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/otp', otpRoutes);

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Project Showcase API is running' });
});

module.exports = router;
