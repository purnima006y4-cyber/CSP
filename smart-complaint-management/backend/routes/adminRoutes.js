const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protectAdmin } = require('../middleware/adminAuth');
const {
  getAdminStats,
  getAllComplaints,
  updateComplaintStatus,
  getAllUsers,
  getReports,
  exportComplaintsCSV
} = require('../controllers/adminController');

const router = express.Router();

router.use(protectAdmin); // All routes protected for Panchayat administrators

router.get('/stats', getAdminStats);
router.get('/complaints', getAllComplaints);
router.put(
  '/complaints/:id',
  [
    body('status')
      .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
      .withMessage('Valid status required'),
    body('remarks').trim().notEmpty().withMessage('Official remarks are required'),
    validate
  ],
  updateComplaintStatus
);
router.get('/users', getAllUsers);
router.get('/reports', getReports);
router.get('/reports/export', exportComplaintsCSV);

module.exports = router;
