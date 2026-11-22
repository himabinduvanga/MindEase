const express = require('express');
const router = express.Router();

const quotes = [
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "You don't have to be perfect to be amazing.",
  "Progress, not perfection.",
  "Your mental health is a priority.",
  "It's okay to not be okay.",
  "You are worthy of love and belonging.",
  "Small steps lead to big changes.",
  "You are enough, just as you are.",
  "Take it one day at a time.",
  "Self-care is not selfish.",
  "You've survived 100% of your bad days.",
  "Healing is not linear.",
  "You are braver than you believe.",
  "Your feelings are valid."
];

const exercises = [
  {
    id: 1,
    name: "Deep Breathing",
    description: "Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.",
    duration: "5 minutes"
  },
  {
    id: 2,
    name: "Progressive Muscle Relaxation",
    description: "Tense and relax each muscle group from toes to head.",
    duration: "10 minutes"
  },
  {
    id: 3,
    name: "Mindful Walking",
    description: "Take a 10-minute walk, focusing on each step and your surroundings.",
    duration: "10 minutes"
  },
  {
    id: 4,
    name: "Gratitude Journaling",
    description: "Write down 3 things you're grateful for today.",
    duration: "5 minutes"
  },
  {
    id: 5,
    name: "Body Scan",
    description: "Slowly scan your body from head to toe, noticing any tension.",
    duration: "10 minutes"
  },
  {
    id: 6,
    name: "5-4-3-2-1 Grounding",
    description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    duration: "3 minutes"
  }
];

// Get random quote
router.get('/random', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

// Get all quotes
router.get('/', (req, res) => {
  res.json({ quotes });
});

// Get all exercises
router.get('/exercises', (req, res) => {
  res.json({ exercises });
});

// Get random exercise
router.get('/exercises/random', (req, res) => {
  const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
  res.json({ exercise: randomExercise });
});

module.exports = router;


