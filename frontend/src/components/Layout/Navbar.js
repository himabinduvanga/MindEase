import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/journal', label: 'Journal' },
    { path: '/medications', label: 'Medications' },
    { path: '/progress', label: 'Progress' },
    { path: '/quotes', label: 'Quotes & Exercises' },
    { path: '/helpline', label: 'Helpline' },
    { path: '/psychologists', label: 'Psychologists' },
    { path: '/games', label: 'Games' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🧠</span>
          MindEase
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


