import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/notes" className="nav-logo">
          📝 AI Notes
        </Link>
        <div className="nav-items">
          <span className="user-info">Welcome, {user?.name || user?.email}</span>
          <Link to="/create" className="nav-link">
            + New Note
          </Link>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
