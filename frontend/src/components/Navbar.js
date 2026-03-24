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
    <nav style={{ background: 'var(--primary-color)', padding: '10px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
      <div className="logo">
        <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem' }}>🏸 Badminton</Link>
      </div>

      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, alignItems: 'center' }}>
        <li><Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>

        {/* GUEST ONLY */}
        {!user && (
          <>
            <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
            <li><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link></li>
            <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
          </>
        )}

        {/* MEMBER & ADMIN */}
        {user && (
          <>
            <li><Link to="/create-post" style={{ color: 'white', textDecoration: 'none' }}>Write</Link></li>
            <li><Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link></li>
            
            {user.role === 'admin' && (
              <li><Link to="/admin" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link></li>
            )}

            <li>
              <button onClick={handleLogout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          </>
        )}

        <li>
          <button onClick={toggleDarkMode} style={{ background: 'none', border: '1px solid white', color: 'white', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer' }}>
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;