import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Journal from './components/Journal/Journal';
import Medications from './components/Medications/Medications';
import Progress from './components/Progress/Progress';
import Quotes from './components/Quotes/Quotes';
import Helpline from './components/Helpline/Helpline';
import Psychologists from './components/Psychologists/Psychologists';
import Games from './components/Games/Games';
import Navbar from './components/Layout/Navbar';
import './App.css';

axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/journal"
            element={
              isAuthenticated ? <Journal /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/medications"
            element={
              isAuthenticated ? <Medications /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/progress"
            element={
              isAuthenticated ? <Progress /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/quotes"
            element={
              isAuthenticated ? <Quotes /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/helpline"
            element={
              isAuthenticated ? <Helpline /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/psychologists"
            element={
              isAuthenticated ? <Psychologists /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/games"
            element={
              isAuthenticated ? <Games /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


