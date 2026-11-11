const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validate');
const { protectUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const {
  createComplaint,
  getMyComplaints,
  trackComplaint,
  getPublicStats
} = require('../controllers/complaintController');

const router = express.Router();

// Optional auth helper for tracking: extracts user if token present without failing if missing
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'venkatapuram_csp_jwt_secret_key_2026_super_secure');
      if (decoded.role === 'admin') {
        req.user = { role: 'admin' };
      } else {
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (user) req.user = user;
      }
    } catch (e) {
      // Ignore token failure for public tracking
    }
  }
  next();
};

// Public endpoints
router.get('/public-stats', getPublicStats);
router.get('/track/:complaintId', optionalAuth, trackComplaint);

// Resident protected endpoints
router.post(
  '/',
  protectUser,
  upload.single('photo'),
  [
    body('title').trim().notEmpty().withMessage('Complaint title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Detailed description is required'),
    body('location').trim().notEmpty().withMessage('Street / landmark location is required'),
    validate
  ],
  createComplaint
);

router.get('/my', protectUser, getMyComplaints);

module.exports = router;
