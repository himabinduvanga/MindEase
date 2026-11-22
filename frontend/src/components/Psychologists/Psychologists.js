import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Psychologists.css';

const Psychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      const res = await axios.get('/psychologists');
      setPsychologists(res.data.psychologists);
    } catch (error) {
      console.error('Error fetching psychologists:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPsychologists();
      return;
    }
    try {
      const res = await axios.get(`/psychologists/search/${searchTerm}`);
      setPsychologists(res.data.psychologists);
    } catch (error) {
      console.error('Error searching psychologists:', error);
    }
  };

  const filteredPsychologists = psychologists.filter(p =>
    p.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="psychologists-page">
      <div className="container">
        <div className="page-header">
          <h1>👨‍⚕️ Find a Psychologist</h1>
          <p>Connect with mental health professionals</p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by specialization, name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>

        <div className="psychologists-grid">
          {filteredPsychologists.length === 0 ? (
            <div className="empty-state">
              <p>No psychologists found. Try a different search term.</p>
            </div>
          ) : (
            filteredPsychologists.map(psychologist => (
              <div key={psychologist.id} className="psychologist-card">
                <div className="psychologist-header">
                  <div className="psychologist-avatar">👨‍⚕️</div>
                  <div>
                    <h3>{psychologist.name}</h3>
                    <p className="specialization">{psychologist.specialization}</p>
                  </div>
                </div>
                <div className="psychologist-details">
                  <p><strong>Experience:</strong> {psychologist.experience}</p>
                  <p><strong>Location:</strong> {psychologist.location}</p>
                  <p><strong>Availability:</strong> {psychologist.availability}</p>
                  <p className="bio">{psychologist.bio}</p>
                </div>
                <div className="psychologist-contact">
                  <a href={`tel:${psychologist.phone.replace(/\D/g, '')}`} className="contact-btn">
                    📞 Call
                  </a>
                  <a href={`mailto:${psychologist.email}`} className="contact-btn">
                    ✉️ Email
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Psychologists;


