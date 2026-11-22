const express = require('express');
const router = express.Router();

const psychologists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Depression",
    experience: "15 years",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@therapy.com",
    availability: "Mon-Fri, 9 AM - 6 PM",
    bio: "Specialized in cognitive behavioral therapy for anxiety and depression."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Trauma & PTSD",
    experience: "12 years",
    location: "Los Angeles, CA",
    phone: "+1 (555) 234-5678",
    email: "michael.chen@therapy.com",
    availability: "Mon-Sat, 10 AM - 7 PM",
    bio: "Expert in EMDR and trauma-focused therapy."
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Child & Adolescent Psychology",
    experience: "10 years",
    location: "Chicago, IL",
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@therapy.com",
    availability: "Mon-Fri, 8 AM - 5 PM",
    bio: "Dedicated to helping children and teens navigate mental health challenges."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Addiction & Recovery",
    experience: "18 years",
    location: "Houston, TX",
    phone: "+1 (555) 456-7890",
    email: "james.wilson@therapy.com",
    availability: "Mon-Fri, 9 AM - 6 PM",
    bio: "Specialized in substance abuse treatment and recovery support."
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialization: "Couples & Family Therapy",
    experience: "14 years",
    location: "Phoenix, AZ",
    phone: "+1 (555) 567-8901",
    email: "lisa.thompson@therapy.com",
    availability: "Mon-Sat, 9 AM - 7 PM",
    bio: "Expert in relationship counseling and family dynamics."
  }
];

// Get all psychologists
router.get('/', (req, res) => {
  res.json({ psychologists });
});

// Get psychologist by ID
router.get('/:id', (req, res) => {
  const psychologist = psychologists.find(p => p.id === parseInt(req.params.id));
  if (!psychologist) {
    return res.status(404).json({ message: 'Psychologist not found' });
  }
  res.json({ psychologist });
});

// Search psychologists by specialization
router.get('/search/:specialization', (req, res) => {
  const { specialization } = req.params;
  const filtered = psychologists.filter(p => 
    p.specialization.toLowerCase().includes(specialization.toLowerCase())
  );
  res.json({ psychologists: filtered });
});

module.exports = router;


