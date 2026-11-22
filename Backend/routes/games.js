const express = require('express');
const router = express.Router();

// Memory game data
const memoryCards = [
  { id: 1, emoji: '😊', matched: false },
  { id: 2, emoji: '😊', matched: false },
  { id: 3, emoji: '🌟', matched: false },
  { id: 4, emoji: '🌟', matched: false },
  { id: 5, emoji: '💚', matched: false },
  { id: 6, emoji: '💚', matched: false },
  { id: 7, emoji: '🎈', matched: false },
  { id: 8, emoji: '🎈', matched: false },
  { id: 9, emoji: '🌈', matched: false },
  { id: 10, emoji: '🌈', matched: false },
  { id: 11, emoji: '🦋', matched: false },
  { id: 12, emoji: '🦋', matched: false }
];

// Get memory game cards
router.get('/memory', (req, res) => {
  const shuffled = [...memoryCards].sort(() => Math.random() - 0.5);
  res.json({ cards: shuffled });
});

// Color matching game
router.get('/color-match', (req, res) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  res.json({ colors });
});

// Word puzzle
router.get('/word-puzzle', (req, res) => {
  const puzzles = [
    {
      id: 1,
      word: 'CALM',
      hint: 'A state of peace and tranquility',
      scrambled: 'MLAC'
    },
    {
      id: 2,
      word: 'PEACE',
      hint: 'Freedom from disturbance',
      scrambled: 'ECPAE'
    },
    {
      id: 3,
      word: 'HAPPY',
      hint: 'Feeling joy and contentment',
      scrambled: 'YHAPP'
    },
    {
      id: 4,
      word: 'RELAX',
      hint: 'To rest and become calm',
      scrambled: 'XELAR'
    }
  ];
  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  res.json({ puzzle: randomPuzzle });
});

module.exports = router;


