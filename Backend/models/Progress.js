const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  sleepHours: Number,
  exerciseMinutes: Number,
  notes: String,
  activities: [String]
});

module.exports = mongoose.model('Progress', progressSchema);


