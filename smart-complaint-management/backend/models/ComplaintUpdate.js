const mongoose = require('mongoose');

const complaintUpdateSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      required: true
    },
    remarks: {
      type: String,
      required: [true, 'Official remarks are required'],
      trim: true
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

complaintUpdateSchema.index({ complaint: 1, createdAt: 1 });

module.exports = mongoose.model('ComplaintUpdate', complaintUpdateSchema);
