const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Drinking Water',
        'Roads and Potholes',
        'Streetlights',
        'Drainage and Sanitation',
        'Garbage Collection',
        'Electricity',
        'Other'
      ],
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    village: {
      type: String,
      default: 'Venkatapuram',
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Street or landmark location is required'],
      trim: true
    },
    photo: {
      type: String,
      default: null
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
      index: true
    },
    assignedTo: {
      type: String,
      default: null,
      trim: true
    },
    complaintDate: {
      type: Date,
      default: Date.now
    },
    resolvedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for fast reporting queries
complaintSchema.index({ status: 1, category: 1 });
complaintSchema.index({ user: 1, complaintDate: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
