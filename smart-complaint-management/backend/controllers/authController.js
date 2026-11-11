const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper to generate JWT token
const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'venkatapuram_csp_jwt_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new resident
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, mobile, email, village, wardNumber, address, password, preferredLanguage } = req.body;

    // Check if mobile or email exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already registered. Please log in or use another number.'
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already registered. Please log in or use another email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      mobile,
      email: email.toLowerCase(),
      village: village || 'Venkatapuram',
      wardNumber: wardNumber || 'Ward 1',
      address: address || '',
      passwordHash,
      preferredLanguage: preferredLanguage || 'en'
    });

    const token = generateToken(user._id, 'user');

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to the Venkatapuram Grievance Portal.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        village: user.village,
        wardNumber: user.wardNumber,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resident login (email OR mobile)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both mobile/email and your password.'
      });
    }

    // Search by email or mobile
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { mobile: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No resident account found with those details.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials and try again.'
      });
    }

    const token = generateToken(user._id, 'user');

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        village: user.village,
        wardNumber: user.wardNumber,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Panchayat Admin login
// @route   POST /api/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide administrative username/email and password.'
      });
    }

    const admin = await Admin.findOne({
      $or: [
        { username: identifier.toLowerCase().trim() },
        { email: identifier.toLowerCase().trim() }
      ]
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative password.'
      });
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      message: `Signed in as ${admin.name} (${admin.role}).`,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};
