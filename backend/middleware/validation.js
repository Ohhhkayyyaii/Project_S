const { body, param, validationResult } = require('express-validator');

// Centralized validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Project validation rules
const validateCreateProject = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  
  body('techStack')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Tech stack must be an array with at least one item'),
  
  body('techStack.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tech stack item must be between 1 and 50 characters'),
  
  body('links')
    .optional()
    .isObject()
    .withMessage('Links must be an object'),
  
  body('links.github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  body('links.live')
    .optional()
    .isURL()
    .withMessage('Please provide a valid live demo URL'),
  
  handleValidationErrors
];

const validateUpdateProject = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  
  body('techStack')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Tech stack must be an array with at least one item'),
  
  body('techStack.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tech stack item must be between 1 and 50 characters'),
  
  body('links')
    .optional()
    .isObject()
    .withMessage('Links must be an object'),
  
  body('links.github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  body('links.live')
    .optional()
    .isURL()
    .withMessage('Please provide a valid live demo URL'),
  
  handleValidationErrors
];

// Rating validation rules
const validateRateProject = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  handleValidationErrors
];

// Project ID validation
const validateProjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateProject,
  validateUpdateProject,
  validateRateProject,
  validateProjectId,
  handleValidationErrors
};
