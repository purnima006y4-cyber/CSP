const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

test('Password Hashing and Comparison Verification', async () => {
  const password = 'Admin@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const match = await bcrypt.compare(password, hash);
  assert.strictEqual(match, true, 'Valid password must match bcrypt hash');

  const mismatch = await bcrypt.compare('WrongPassword', hash);
  assert.strictEqual(mismatch, false, 'Invalid password must not match');
});

test('JWT Token Generation and Verification', () => {
  const secret = 'test_secret_key_123';
  const token = jwt.sign({ id: 'user123', role: 'user' }, secret, { expiresIn: '1h' });

  const decoded = jwt.verify(token, secret);
  assert.strictEqual(decoded.id, 'user123');
  assert.strictEqual(decoded.role, 'user');
});

test('CSV Export Formatting Verification', () => {
  const complaintsToCSV = require('../utils/csvExport');
  const mockComplaints = [
    {
      complaintId: 'SCM-2026-0001',
      user: { fullName: 'Venkat Rao', mobile: '9876543210', wardNumber: 'Ward 2' },
      category: 'Drinking Water',
      priority: 'High',
      status: 'In Progress',
      title: 'Water pipe leak',
      location: 'Temple Street',
      assignedTo: 'B. Naidu',
      complaintDate: new Date('2026-11-05T08:30:00Z'),
      resolvedDate: null
    }
  ];

  const csv = complaintsToCSV(mockComplaints);
  assert.ok(csv.startsWith('\uFEFF'), 'CSV must include UTF-8 BOM');
  assert.ok(csv.includes('"SCM-2026-0001"'), 'CSV must include complaint ID');
  assert.ok(csv.includes('"Venkat Rao"'), 'CSV must include resident name');
  assert.ok(csv.includes('"Drinking Water"'), 'CSV must include category');
  assert.ok(csv.includes('"B. Naidu"'), 'CSV must include assigned staff');
});

test('Mongoose Models Schema Verification', () => {
  const User = require('../models/User');
  const Admin = require('../models/Admin');
  const Complaint = require('../models/Complaint');
  const ComplaintUpdate = require('../models/ComplaintUpdate');
  const Notification = require('../models/Notification');
  const Counter = require('../models/Counter');

  assert.ok(User.schema.paths.fullName, 'User must have fullName');
  assert.ok(User.schema.paths.mobile, 'User must have mobile');
  assert.ok(User.schema.paths.email, 'User must have email');
  assert.ok(User.schema.paths.passwordHash, 'User must have passwordHash');

  assert.ok(Admin.schema.paths.username, 'Admin must have username');
  assert.ok(Admin.schema.paths.role, 'Admin must have role');

  assert.ok(Complaint.schema.paths.complaintId, 'Complaint must have complaintId');
  assert.ok(Complaint.schema.paths.user, 'Complaint must have user ref');
  assert.ok(Complaint.schema.paths.category, 'Complaint must have category');
  assert.ok(Complaint.schema.paths.status, 'Complaint must have status');

  assert.ok(ComplaintUpdate.schema.paths.complaint, 'ComplaintUpdate must have complaint ref');
  assert.ok(ComplaintUpdate.schema.paths.remarks, 'ComplaintUpdate must have remarks');

  assert.ok(Notification.schema.paths.user, 'Notification must have user ref');
  assert.ok(Notification.schema.paths.isRead, 'Notification must have isRead');

  assert.ok(Counter.schema.paths.seq, 'Counter must have seq');
});
