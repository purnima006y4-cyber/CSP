const express = require('express');
const { protectUser } = require('../middleware/auth');
const {
  getUserNotifications,
  markAsRead,
  markAllRead
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protectUser); // Protected for resident

router.get('/', getUserNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markAsRead);

module.exports = router;
