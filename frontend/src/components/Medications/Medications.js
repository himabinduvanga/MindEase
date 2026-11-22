import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Medications.css';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: [],
    startDate: '',
    endDate: '',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const res = await axios.get('/medications');
      setMedications(res.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTimeChange = (e) => {
    const { value, checked } = e.target;
    let newTimes = [...formData.time];
    if (checked) {
      newTimes.push(value);
    } else {
      newTimes = newTimes.filter(t => t !== value);
    }
    setFormData({ ...formData, time: newTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/medications/${editingId}`, formData);
      } else {
        await axios.post('/medications', formData);
      }
      resetForm();
      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Error saving medication');
    }
  };

  const handleEdit = (medication) => {
    setFormData({
      ...medication,
      startDate: medication.startDate ? new Date(medication.startDate).toISOString().split('T')[0] : '',
      endDate: medication.endDate ? new Date(medication.endDate).toISOString().split('T')[0] : ''
    });
    setEditingId(medication._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await axios.delete(`/medications/${id}`);
        fetchMedications();
      } catch (error) {
        console.error('Error deleting medication:', error);
        alert('Error deleting medication');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: [],
      startDate: '',
      endDate: '',
      notes: '',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="medications-page">
      <div className="container">
        <div className="page-header">
          <h1>💊 My Medications</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add Medication'}
          </button>
        </div>

        {showForm && (
          <div className="medication-form-card">
            <h2>{editingId ? 'Edit Medication' : 'Add New Medication'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Medication Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Sertraline"
                  />
                </div>

                <div className="input-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 50mg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Frequency</label>
                  <select name="frequency" value={formData.frequency} onChange={handleChange} required>
                    <option value="daily">Daily</option>
                    <option value="twice-daily">Twice Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Time of Day</label>
                  <div className="time-selector">
                    {timeSlots.map(slot => (
                      <label key={slot} className="time-option">
                        <input
                          type="checkbox"
                          value={slot.toLowerCase()}
                          checked={formData.time.includes(slot.toLowerCase())}
                          onChange={handleTimeChange}
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="input-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active Medication
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Medication' : 'Add Medication'}
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

        <div className="medications-list">
          {medications.length === 0 ? (
            <div className="empty-state">
              <p>No medications added yet. Add your first medication to get started!</p>
            </div>
          ) : (
            medications.map(medication => (
              <div key={medication._id} className={`medication-card ${!medication.isActive ? 'inactive' : ''}`}>
                <div className="medication-header">
                  <h3>{medication.name}</h3>
                  <span className={`status-badge ${medication.isActive ? 'active' : 'inactive'}`}>
                    {medication.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="medication-details">
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                  <p><strong>Frequency:</strong> {medication.frequency}</p>
                  <p><strong>Time:</strong> {medication.time.join(', ')}</p>
                  {medication.startDate && (
                    <p><strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()}</p>
                  )}
                  {medication.endDate && (
                    <p><strong>End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}</p>
                  )}
                  {medication.notes && (
                    <p><strong>Notes:</strong> {medication.notes}</p>
                  )}
                </div>
                <div className="medication-actions">
                  <button onClick={() => handleEdit(medication)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(medication._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;


