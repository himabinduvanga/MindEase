const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const auth = require('../middleware/auth');

// Get all medications
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user.userId }).sort({ startDate: -1 });
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active medications
router.get('/active', auth, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user.userId, isActive: true });
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create medication
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, frequency, time, startDate, endDate, notes } = req.body;
    const medication = new Medication({
      userId: req.user.userId,
      name,
      dosage,
      frequency,
      time: Array.isArray(time) ? time : [time],
      startDate: startDate || new Date(),
      endDate,
      notes
    });
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update medication
router.put('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete medication
router.delete('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


