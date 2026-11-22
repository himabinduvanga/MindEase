import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Helpline.css';

const Helpline = () => {
  const [helplines, setHelplines] = useState([]);

  useEffect(() => {
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      const res = await axios.get('/helpline');
      setHelplines(res.data.helplines);
    } catch (error) {
      console.error('Error fetching helplines:', error);
    }
  };

  return (
    <div className="helpline-page">
      <div className="container">
        <div className="page-header">
          <h1>📞 Helpline Numbers</h1>
          <p>24/7 support is available. You're not alone.</p>
        </div>

        <div className="helpline-grid">
          {helplines.map(helpline => (
            <div key={helpline.id} className="helpline-card">
              <div className="helpline-icon">📞</div>
              <h3>{helpline.name}</h3>
              <div className="helpline-number">
                <strong>{helpline.number}</strong>
              </div>
              <p className="helpline-description">{helpline.description}</p>
              <div className="helpline-availability">
                <span className="availability-badge">🕐 {helpline.available}</span>
              </div>
              <a href={`tel:${helpline.number.replace(/\D/g, '')}`} className="call-button">
                Call Now
              </a>
            </div>
          ))}
        </div>

        <div className="emergency-notice">
          <h2>🚨 Emergency</h2>
          <p>If you're in immediate danger or having thoughts of self-harm, please call 911 or your local emergency number immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default Helpline;


