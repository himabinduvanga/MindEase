import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Games.css';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wordPuzzle, setWordPuzzle] = useState(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  useEffect(() => {
    if (activeGame === 'memory') {
      loadMemoryGame();
    } else if (activeGame === 'word-puzzle') {
      loadWordPuzzle();
    }
  }, [activeGame]);

  const loadMemoryGame = async () => {
    try {
      const res = await axios.get('/games/memory');
      setMemoryCards(res.data.cards.map((card, index) => ({ ...card, id: index })));
      setFlippedCards([]);
      setMatchedPairs([]);
    } catch (error) {
      console.error('Error loading memory game:', error);
    }
  };

  const loadWordPuzzle = async () => {
    try {
      const res = await axios.get('/games/word-puzzle');
      setWordPuzzle(res.data.puzzle);
      setPuzzleAnswer('');
      setPuzzleSolved(false);
    } catch (error) {
      console.error('Error loading word puzzle:', error);
    }
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === first);
      const secondCard = memoryCards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs([...matchedPairs, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const checkPuzzleAnswer = () => {
    if (puzzleAnswer.toLowerCase() === wordPuzzle.word.toLowerCase()) {
      setPuzzleSolved(true);
    } else {
      alert('Incorrect! Try again.');
    }
  };

  const games = [
    { id: 'memory', name: 'Memory Game', icon: '🧠', description: 'Match pairs of emojis' },
    { id: 'word-puzzle', name: 'Word Puzzle', icon: '🔤', description: 'Unscramble the word' }
  ];

  return (
    <div className="games-page">
      <div className="container">
        <div className="page-header">
          <h1>🎮 Fun Games</h1>
          <p>Take a break and have some fun!</p>
        </div>

        {!activeGame ? (
          <div className="games-menu">
            <div className="games-grid">
              {games.map(game => (
                <div
                  key={game.id}
                  className="game-card"
                  onClick={() => setActiveGame(game.id)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                  <button className="btn btn-primary">Play</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="game-container">
            <button onClick={() => setActiveGame(null)} className="back-btn">
              ← Back to Games
            </button>

            {activeGame === 'memory' && (
              <div className="memory-game">
                <h2>Memory Game</h2>
                <p>Match the pairs! Click cards to flip them.</p>
                {matchedPairs.length === memoryCards.length && memoryCards.length > 0 && (
                  <div className="win-message">🎉 Congratulations! You won!</div>
                )}
                <div className="memory-grid">
                  {memoryCards.map(card => {
                    const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                        onClick={() => handleCardClick(card.id)}
                      >
                        {isFlipped ? card.emoji : '?'}
                      </div>
                    );
                  })}
                </div>
                <button onClick={loadMemoryGame} className="btn btn-secondary">
                  Reset Game
                </button>
              </div>
            )}

            {activeGame === 'word-puzzle' && wordPuzzle && (
              <div className="word-puzzle-game">
                <h2>Word Puzzle</h2>
                <p className="hint">Hint: {wordPuzzle.hint}</p>
                <div className="scrambled-word">
                  {wordPuzzle.scrambled.split('').map((letter, index) => (
                    <span key={index} className="scrambled-letter">{letter}</span>
                  ))}
                </div>
                <div className="puzzle-input">
                  <input
                    type="text"
                    value={puzzleAnswer}
                    onChange={(e) => setPuzzleAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    disabled={puzzleSolved}
                  />
                  {!puzzleSolved ? (
                    <button onClick={checkPuzzleAnswer} className="btn btn-primary">
                      Check Answer
                    </button>
                  ) : (
                    <div className="success-message">🎉 Correct! Well done!</div>
                  )}
                </div>
                <button onClick={loadWordPuzzle} className="btn btn-secondary">
                  New Puzzle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;


