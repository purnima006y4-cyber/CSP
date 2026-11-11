const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { register, login, adminLogin } = require('../controllers/authController');

const router = express.Router();

// Rate limiter for authentication routes (15 requests per 10 minutes)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 10 minutes.'
  }
});

// Validation rules
const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobile')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian mobile number'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('identifier').trim().notEmpty().withMessage('Email or mobile number is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

router.post('/register', registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/admin/login', authLimiter, loginValidation, adminLogin);

module.exports = router;
