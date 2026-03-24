// frontend/src/components/Nav.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Nav = ({ toggleDarkMode, isDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/home">🏸 Badminton</Link>
        </div>

        <ul className="nav-menu">
          {/* Common for all users */}
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>

          {/* Guest (Not logged in) - may Contact */}
          {!user && (
            <>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {/* Member (Logged in) - may Contact */}
          {user && user.role === 'member' && (
            <>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/create-post">Write</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Admin (Logged in as admin) - WALANG Contact */}
          {user && user.role === 'admin' && (
            <>
              <li><Link to="/create-post">Write</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/admin" className="admin-link">Admin</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Dark Mode Toggle for all */}
          <li>
            <button onClick={toggleDarkMode} className="dark-mode-btn">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;