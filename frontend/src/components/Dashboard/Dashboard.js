import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    journalEntries: 0,
    medications: 0,
    progressEntries: 0,
    avgMoodScore: 0
  });
  const [recentJournals, setRecentJournals] = useState([]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [journalsRes, medicationsRes, progressRes, quoteRes] = await Promise.all([
        axios.get('/journal'),
        axios.get('/medications/active'),
        axios.get('/progress'),
        axios.get('/quotes/random')
      ]);

      setStats({
        journalEntries: journalsRes.data.length,
        medications: medicationsRes.data.length,
        progressEntries: progressRes.data.length,
        avgMoodScore: progressRes.data.length > 0
          ? (progressRes.data.reduce((sum, p) => sum + p.moodScore, 0) / progressRes.data.length).toFixed(1)
          : 0
      });

      setRecentJournals(journalsRes.data.slice(0, 3));
      setQuote(quoteRes.data.quote);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const quickLinks = [
    { path: '/journal', label: 'Write Journal', icon: '📝', color: '#667eea' },
    { path: '/medications', label: 'Medications', icon: '💊', color: '#4ECDC4' },
    { path: '/progress', label: 'Track Progress', icon: '📊', color: '#45B7D1' },
    { path: '/quotes', label: 'Get Inspired', icon: '✨', color: '#FFA07A' },
    { path: '/games', label: 'Play Games', icon: '🎮', color: '#98D8C8' },
    { path: '/psychologists', label: 'Find Help', icon: '👨‍⚕️', color: '#F7DC6F' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's your wellness overview</p>
        </div>

        <div className="quote-card">
          <div className="quote-icon">💭</div>
          <p className="quote-text">"{quote}"</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{stats.journalEntries}</h3>
              <p>Journal Entries</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💊</div>
            <div className="stat-info">
              <h3>{stats.medications}</h3>
              <p>Active Medications</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.progressEntries}</h3>
              <p>Progress Records</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-info">
              <h3>{stats.avgMoodScore}</h3>
              <p>Avg Mood Score</p>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h2>Quick Actions</h2>
          <div className="links-grid">
            {quickLinks.map(link => (
              <Link key={link.path} to={link.path} className="quick-link-card">
                <div className="quick-link-icon" style={{ background: link.color }}>
                  {link.icon}
                </div>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {recentJournals.length > 0 && (
          <div className="recent-journals">
            <h2>Recent Journal Entries</h2>
            <div className="journals-list">
              {recentJournals.map(journal => (
                <div key={journal._id} className="journal-preview">
                  <h3>{journal.title}</h3>
                  <p>{journal.content.substring(0, 100)}...</p>
                  <span className="journal-mood">Mood: {journal.mood}</span>
                </div>
              ))}
            </div>
            <Link to="/journal" className="view-all-link">View All Entries →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


