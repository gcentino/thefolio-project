// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../index.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const { data } = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data);
      setMessage('Profile updated successfully!');
      setProfilePic(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.profilePic ? (
              <img 
                src={`http://localhost:5000/uploads/${user.profilePic}`} 
                alt={user?.name}
              />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="user-email">{user?.email}</p>
            <p className="user-role">
              <span className={`role-badge ${user?.role}`}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 Member'}
              </span>
            </p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📝 Edit Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Change Password
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="image-input"
                  />
                  <label htmlFor="profilePic" className="image-label">
                    {profilePic ? profilePic.name : '📷 Choose a profile picture'}
                  </label>
                  {profilePic && (
                    <p className="image-preview-text">Selected: {profilePic.name}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="update-btn" disabled={loading}>
                {loading ? 'Updating...' : '💾 Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="password-form">
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <button type="submit" className="update-btn" disabled={loading}>
                {loading ? 'Changing...' : '🔐 Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;