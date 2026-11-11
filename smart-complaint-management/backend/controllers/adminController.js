const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const Notification = require('../models/Notification');
const User = require('../models/User');
const complaintsToCSV = require('../utils/csvExport');

// @desc    Get metrics and category chart data for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    const totalUsers = await User.countDocuments();

    // Category-wise count
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Format for Chart.js
    const categoryMap = {
      'Drinking Water': 0,
      'Roads and Potholes': 0,
      'Streetlights': 0,
      'Drainage and Sanitation': 0,
      'Garbage Collection': 0,
      'Electricity': 0,
      'Other': 0
    };

    categoryStats.forEach((c) => {
      if (categoryMap.hasOwnProperty(c._id)) {
        categoryMap[c._id] = c.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        totalUsers,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        categoryBreakdown: categoryMap
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints with search and filters
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      // Find matching users first if searching by user name/mobile
      const matchedUsers = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = matchedUsers.map((u) => u._id);

      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { user: { $in: userIds } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('user', 'fullName mobile email wardNumber village address')
      .sort({ complaintDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status, staff assignment, and log remarks
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, remarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint record not found.'
      });
    }

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Official remarks must be provided for every status update.'
      });
    }

    // Update complaint document
    if (status) complaint.status = status;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (status === 'Resolved' && !complaint.resolvedDate) {
      complaint.resolvedDate = new Date();
    }
    await complaint.save();

    // Log progress timeline update
    const officerName = req.admin ? `${req.admin.name} (${req.admin.role})` : 'Panchayat Secretary';
    await ComplaintUpdate.create({
      complaint: complaint._id,
      status: complaint.status,
      remarks,
      updatedBy: officerName
    });

    // Create resident notification
    const notificationMessage = `Your complaint ${complaint.complaintId} status changed to ${complaint.status}. Remarks: ${remarks.substring(0, 80)}`;
    await Notification.create({
      user: complaint.user,
      complaint: complaint._id,
      message: notificationMessage
    });

    res.status(200).json({
      success: true,
      message: `Complaint ${complaint.complaintId} updated successfully and resident notified.`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered residents and their grievance activity
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, ward } = req.query;

    const query = {};
    if (ward) query.wardNumber = ward;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate complaints count per user
    const userStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$user',
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      }
    ]);

    const statsMap = {};
    userStats.forEach((s) => {
      statsMap[s._id.toString()] = {
        total: s.total,
        pending: s.pending,
        resolved: s.resolved
      };
    });

    const enrichedUsers = users.map((u) => {
      const stats = statsMap[u._id.toString()] || { total: 0, pending: 0, resolved: 0 };
      return {
        ...u.toObject(),
        complaintStats: stats
      };
    });

    res.status(200).json({
      success: true,
      total: enrichedUsers.length,
      data: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Chart.js datasets for Reports page
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    // 1. Category Breakdown
    const catStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // 2. Status Breakdown
    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Priority Breakdown
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // 4. Monthly Inflow Trend (Last 6 months)
    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$complaintDate' },
            month: { $month: '$complaintDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = monthlyStats.map((m) => ({
      label: `${monthNames[m._id.month]} ${m._id.year}`,
      count: m.count
    }));

    res.status(200).json({
      success: true,
      data: {
        categories: catStats,
        statuses: statusStats,
        priorities: priorityStats,
        monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export complaints to CSV
// @route   GET /api/admin/reports/export
// @access  Private (Admin)
exports.exportComplaintsCSV = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'fullName mobile wardNumber')
      .sort({ complaintDate: -1 });

    const csvData = complaintsToCSV(complaints);
    const filename = `venkatapuram_grievances_${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
