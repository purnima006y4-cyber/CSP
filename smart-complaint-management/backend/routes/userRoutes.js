const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protectUser } = require('../middleware/auth');
const { getMe, updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();

router.use(protectUser); // All routes protected for resident

router.get('/me', getMe);

router.put(
  '/me',
  [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('mobile')
      .optional()
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please enter a valid 10-digit mobile number'),
    body('email').optional().trim().isEmail().withMessage('Please enter a valid email address'),
    validate
  ],
  updateProfile
);

router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    validate
  ],
  changePassword
);

module.exports = router;
