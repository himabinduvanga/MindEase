const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get all progress entries
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.userId };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const progress = await Progress.find(query).sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create progress entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, moodScore, sleepHours, exerciseMinutes, notes, activities } = req.body;
    const progress = new Progress({
      userId: req.user.userId,
      date: date || new Date(),
      moodScore,
      sleepHours,
      exerciseMinutes,
      notes,
      activities: Array.isArray(activities) ? activities : []
    });
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress entry
router.put('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete progress entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.json({ message: 'Progress entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


