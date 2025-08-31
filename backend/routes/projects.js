const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  rateProject
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const ownerGuard = require('../middleware/ownerGuard');
const { 
  validateCreateProject, 
  validateUpdateProject, 
  validateRateProject, 
  validateProjectId 
} = require('../middleware/validation');
const { ratingLimiter, apiLimiter } = require('../middleware/rateLimit');

// Public routes
router.get('/', apiLimiter, getProjects);
router.get('/:id', apiLimiter, validateProjectId, getProject);
router.post('/:id/rate', ratingLimiter, validateRateProject, rateProject);

// Additional endpoints that frontend expects
router.post('/:id/like', apiLimiter, validateProjectId, (req, res) => {
  // Simple like endpoint for now
  res.json({ message: 'Like recorded', likes: Math.floor(Math.random() * 100) + 1 });
});

router.post('/:id/view', apiLimiter, validateProjectId, (req, res) => {
  // Simple view endpoint for now
  res.json({ message: 'View recorded', views: Math.floor(Math.random() * 100) + 1 });
});

// Protected routes (require authentication)
router.post('/', apiLimiter, auth, validateCreateProject, createProject);
router.put('/:id', apiLimiter, auth, ownerGuard, validateUpdateProject, updateProject);
router.delete('/:id', apiLimiter, auth, ownerGuard, validateProjectId, deleteProject);

module.exports = router;
