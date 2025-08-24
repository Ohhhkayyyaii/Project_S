const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const ownerGuard = require('../middleware/ownerGuard');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes (require authentication)
router.post('/', auth, createProject);
router.put('/:id', auth, ownerGuard, updateProject);
router.delete('/:id', auth, ownerGuard, deleteProject);

module.exports = router;
