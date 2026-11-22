import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quotes.css';

const Quotes = () => {
  const [quote, setQuote] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchQuote();
    fetchExercises();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await axios.get('/quotes/random');
      setQuote(res.data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await axios.get('/quotes/exercises');
      setExercises(res.data.exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const getRandomExercise = async () => {
    try {
      const res = await axios.get('/quotes/exercises/random');
      setSelectedExercise(res.data.exercise);
    } catch (error) {
      console.error('Error fetching random exercise:', error);
    }
  };

  return (
    <div className="quotes-page">
      <div className="container">
        <div className="page-header">
          <h1>✨ Quotes & Exercises</h1>
        </div>

        <div className="quote-section">
          <div className="quote-card-large">
            <div className="quote-icon-large">💭</div>
            <p className="quote-text-large">"{quote}"</p>
            <button onClick={fetchQuote} className="btn btn-primary">
              Get New Quote
            </button>
          </div>
        </div>

        <div className="exercises-section">
          <h2>Wellness Exercises</h2>
          <div className="exercise-controls">
            <button onClick={getRandomExercise} className="btn btn-primary">
              Get Random Exercise
            </button>
          </div>

          {selectedExercise && (
            <div className="selected-exercise">
              <h3>{selectedExercise.name}</h3>
              <p className="exercise-description">{selectedExercise.description}</p>
              <div className="exercise-duration">
                ⏱️ Duration: {selectedExercise.duration}
              </div>
            </div>
          )}

          <div className="exercises-grid">
            {exercises.map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
                <div className="exercise-footer">
                  <span className="duration-badge">⏱️ {exercise.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;


