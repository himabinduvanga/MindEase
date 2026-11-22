const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

// Get all journal entries
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(journals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single journal entry
router.get('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const journal = new Journal({
      userId: req.user.userId,
      title,
      content,
      mood: mood || 'neutral'
    });
    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update journal entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, mood },
      { new: true }
    );
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


