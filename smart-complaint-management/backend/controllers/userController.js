const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Get current logged in resident profile
// @route   GET /api/users/me
// @access  Private (Resident)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current resident profile details
// @route   PUT /api/users/me
// @access  Private (Resident)
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, mobile, email, wardNumber, address, preferredLanguage } = req.body;

    // Check duplicate mobile excluding self
    if (mobile && mobile !== req.user.mobile) {
      const dupMobile = await User.findOne({ mobile, _id: { $ne: req.user._id } });
      if (dupMobile) {
        return res.status(400).json({
          success: false,
          message: 'That mobile number is already in use by another resident.'
        });
      }
    }

    // Check duplicate email excluding self
    if (email && email.toLowerCase() !== req.user.email) {
      const dupEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
      if (dupEmail) {
        return res.status(400).json({
          success: false,
          message: 'That email address is already in use by another resident.'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName || req.user.fullName,
        mobile: mobile || req.user.mobile,
        email: email ? email.toLowerCase() : req.user.email,
        wardNumber: wardNumber || req.user.wardNumber,
        address: address !== undefined ? address : req.user.address,
        preferredLanguage: preferredLanguage || req.user.preferredLanguage
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change resident password
// @route   PUT /api/users/me/password
// @access  Private (Resident)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
