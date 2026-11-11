const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Administrative authorization token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'venkatapuram_csp_jwt_secret_key_2026_super_secure');

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to Panchayat administrators.'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Administrative account not found.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Admin authorization token is invalid or expired.'
    });
  }
};

module.exports = { protectAdmin };
