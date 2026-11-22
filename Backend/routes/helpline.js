const express = require('express');
const router = express.Router();

const helplines = [
  {
    id: 1,
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 crisis support",
    available: "24/7"
  },
  {
    id: 2,
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Free 24/7 crisis support via text",
    available: "24/7"
  },
  {
    id: 3,
    name: "National Alliance on Mental Illness (NAMI)",
    number: "1-800-950-NAMI (6264)",
    description: "Mental health support and resources",
    available: "Monday-Friday, 10 AM - 10 PM ET"
  },
  {
    id: 4,
    name: "SAMHSA National Helpline",
    number: "1-800-662-HELP (4357)",
    description: "Substance abuse and mental health services",
    available: "24/7"
  },
  {
    id: 5,
    name: "Veterans Crisis Line",
    number: "1-800-273-8255",
    description: "Crisis support for veterans",
    available: "24/7"
  },
  {
    id: 6,
    name: "Disaster Distress Helpline",
    number: "1-800-985-5990",
    description: "Crisis counseling for disaster survivors",
    available: "24/7"
  }
];

// Get all helplines
router.get('/', (req, res) => {
  res.json({ helplines });
});

// Get helpline by ID
router.get('/:id', (req, res) => {
  const helpline = helplines.find(h => h.id === parseInt(req.params.id));
  if (!helpline) {
    return res.status(404).json({ message: 'Helpline not found' });
  }
  res.json({ helpline });
});

module.exports = router;


