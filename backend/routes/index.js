const express = require('express');
const router = express.Router();

// Import auth routes
const authRoutes = require('./auth');

// Mount auth routes
router.use('/auth', authRoutes);

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Project Showcase API is running' });
});

module.exports = router;
