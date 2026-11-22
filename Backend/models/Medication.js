const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  time: {
    type: [String],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Medication', medicationSchema);


