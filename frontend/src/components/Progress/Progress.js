import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Progress.css';

const Progress = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    moodScore: 5,
    sleepHours: '',
    exerciseMinutes: '',
    notes: '',
    activities: []
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get('/progress');
      setProgressEntries(res.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'moodScore' || name === 'sleepHours' || name === 'exerciseMinutes' 
        ? (value === '' ? '' : Number(value)) 
        : value
    });
  };

  const handleActivityChange = (activity) => {
    const activities = formData.activities.includes(activity)
      ? formData.activities.filter(a => a !== activity)
      : [...formData.activities, activity];
    setFormData({ ...formData, activities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/progress/${editingId}`, formData);
      } else {
        await axios.post('/progress', formData);
      }
      resetForm();
      fetchProgress();
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Error saving progress entry');
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      ...entry,
      date: new Date(entry.date).toISOString().split('T')[0]
    });
    setEditingId(entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`/progress/${id}`);
        fetchProgress();
      } catch (error) {
        console.error('Error deleting progress:', error);
        alert('Error deleting progress entry');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      moodScore: 5,
      sleepHours: '',
      exerciseMinutes: '',
      notes: '',
      activities: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const activities = ['Exercise', 'Meditation', 'Reading', 'Socializing', 'Hobbies', 'Rest'];

  return (
    <div className="progress-page">
      <div className="container">
        <div className="page-header">
          <h1>📊 Progress Tracking</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Entry'}
          </button>
        </div>

        {showForm && (
          <div className="progress-form-card">
            <h2>{editingId ? 'Edit Entry' : 'New Progress Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Mood Score (1-10)</label>
                  <input
                    type="range"
                    name="moodScore"
                    min="1"
                    max="10"
                    value={formData.moodScore}
                    onChange={handleChange}
                    required
                  />
                  <div className="mood-display">{formData.moodScore}/10</div>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Sleep Hours</label>
                  <input
                    type="number"
                    name="sleepHours"
                    min="0"
                    max="24"
                    value={formData.sleepHours}
                    onChange={handleChange}
                    placeholder="Hours"
                  />
                </div>

                <div className="input-group">
                  <label>Exercise Minutes</label>
                  <input
                    type="number"
                    name="exerciseMinutes"
                    min="0"
                    value={formData.exerciseMinutes}
                    onChange={handleChange}
                    placeholder="Minutes"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Activities</label>
                <div className="activities-selector">
                  {activities.map(activity => (
                    <label key={activity} className="activity-option">
                      <input
                        type="checkbox"
                        checked={formData.activities.includes(activity)}
                        onChange={() => handleActivityChange(activity)}
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Additional notes about your day..."
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

        <div className="progress-list">
          {progressEntries.length === 0 ? (
            <div className="empty-state">
              <p>No progress entries yet. Start tracking your wellness journey!</p>
            </div>
          ) : (
            progressEntries.map(entry => (
              <div key={entry._id} className="progress-card">
                <div className="progress-header">
                  <h3>{new Date(entry.date).toLocaleDateString()}</h3>
                  <div className="mood-badge">
                    {entry.moodScore}/10
                  </div>
                </div>
                <div className="progress-details">
                  {entry.sleepHours && <p>💤 Sleep: {entry.sleepHours} hours</p>}
                  {entry.exerciseMinutes && <p>🏃 Exercise: {entry.exerciseMinutes} minutes</p>}
                  {entry.activities && entry.activities.length > 0 && (
                    <p>✨ Activities: {entry.activities.join(', ')}</p>
                  )}
                  {entry.notes && <p className="notes">📝 {entry.notes}</p>}
                </div>
                <div className="progress-actions">
                  <button onClick={() => handleEdit(entry)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(entry._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;


