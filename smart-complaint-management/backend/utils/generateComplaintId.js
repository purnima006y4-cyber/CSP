const Counter = require('../models/Counter');

/**
 * Safely generates unique, sequential Complaint IDs (e.g. SCM-2026-0001)
 * Uses atomic MongoDB $inc on the Counter collection to prevent race conditions.
 *
 * @returns {Promise<string>}
 */
async function generateComplaintId() {
  const year = new Date().getFullYear();
  const counterId = `complaintId_${year}`;

  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = String(counter.seq).padStart(4, '0');
  return `SCM-${year}-${seqNumber}`;
}

module.exports = generateComplaintId;
