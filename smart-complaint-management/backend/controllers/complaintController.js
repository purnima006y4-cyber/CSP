const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const User = require('../models/User');
const generateComplaintId = require('../utils/generateComplaintId');

// @desc    Register a new grievance
// @route   POST /api/complaints
// @access  Private (Resident)
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, village, location, priority } = req.body;

    const complaintId = await generateComplaintId();
    const photo = req.file ? req.file.filename : null;

    const complaint = await Complaint.create({
      complaintId,
      user: req.user._id,
      title,
      category,
      description,
      village: village || 'Venkatapuram',
      location,
      priority: priority || 'Medium',
      photo,
      status: 'Pending'
    });

    // Create initial timeline audit step
    await ComplaintUpdate.create({
      complaint: complaint._id,
      status: 'Pending',
      remarks: `Grievance registered by resident ${req.user.fullName} (${req.user.wardNumber || 'Ward 1'}).`,
      updatedBy: 'System'
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully!',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints lodged by the current logged-in resident
// @route   GET /api/complaints/my
// @access  Private (Resident)
exports.getMyComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, search, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ complaintDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track a complaint and its full progress timeline
// @route   GET /api/complaints/track/:complaintId
// @access  Public / Semi-Private (Ownership enforced if user logged in)
exports.trackComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ complaintId: complaintId.trim().toUpperCase() })
      .populate('user', 'fullName mobile wardNumber village');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No grievance found with Tracking ID: ${complaintId}`
      });
    }

    // Ownership check: If a resident is logged in, they can only view their own complaints
    if (req.user && req.user.role !== 'admin') {
      if (complaint.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access Restricted: You can only view grievances submitted from your account.'
        });
      }
    }

    // Fetch chronological timeline updates
    const updates = await ComplaintUpdate.find({ complaint: complaint._id })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        complaint,
        updates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get high level summary stats for homepage banner
// @route   GET /api/complaints/public-stats
// @access  Public
exports.getPublicStats = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalResidents = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalComplaints,
        resolvedComplaints,
        totalResidents,
        resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 85
      }
    });
  } catch (error) {
    next(error);
  }
};
