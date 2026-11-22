import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Journal.css';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await axios.get('/journal');
      setJournals(res.data);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/journal/${editingId}`, formData);
      } else {
        await axios.post('/journal', formData);
      }
      resetForm();
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('Error saving journal entry');
    }
  };

  const handleEdit = (journal) => {
    setFormData({
      title: journal.title,
      content: journal.content,
      mood: journal.mood
    });
    setEditingId(journal._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`/journal/${id}`);
        fetchJournals();
      } catch (error) {
        console.error('Error deleting journal:', error);
        alert('Error deleting journal entry');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', mood: 'neutral' });
    setEditingId(null);
    setShowForm(false);
  };

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'angry', emoji: '😠', label: 'Angry' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' }
  ];

  return (
    <div className="journal-page">
      <div className="container">
        <div className="page-header">
          <h1>📝 My Journal</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Entry'}
          </button>
        </div>

        {showForm && (
          <div className="journal-form-card">
            <h2>{editingId ? 'Edit Entry' : 'New Journal Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Give your entry a title"
                />
              </div>

              <div className="input-group">
                <label>Mood</label>
                <div className="mood-selector">
                  {moods.map(mood => (
                    <label key={mood.value} className="mood-option">
                      <input
                        type="radio"
                        name="mood"
                        value={mood.value}
                        checked={formData.mood === mood.value}
                        onChange={handleChange}
                      />
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="8"
                  placeholder="Write your thoughts here..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="journals-list">
          {journals.length === 0 ? (
            <div className="empty-state">
              <p>No journal entries yet. Start writing to track your thoughts and feelings!</p>
            </div>
          ) : (
            journals.map(journal => {
              const moodEmoji = moods.find(m => m.value === journal.mood)?.emoji || '😐';
              return (
                <div key={journal._id} className="journal-card">
                  <div className="journal-header">
                    <h3>{journal.title}</h3>
                    <span className="journal-mood">{moodEmoji} {journal.mood}</span>
                  </div>
                  <p className="journal-content">{journal.content}</p>
                  <div className="journal-footer">
                    <span className="journal-date">
                      {new Date(journal.date).toLocaleDateString()}
                    </span>
                    <div className="journal-actions">
                      <button onClick={() => handleEdit(journal)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(journal._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;


