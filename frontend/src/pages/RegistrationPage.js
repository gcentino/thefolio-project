import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    level: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let newErrors = {};
    const { name, email, dob, password, confirmPassword, level, terms } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";

    if (!dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      let birthDate = new Date(dob);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) newErrors.dob = "You must be at least 18 years old.";
    }

    if (password.length < 6) newErrors.password = "At least 6 characters required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!level) newErrors.level = "Select your skill level";
    if (!terms) newErrors.terms = "Please accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Send registration to backend
        const { data } = await API.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        console.log('Registration success:', data);
        
        // Save token and user
        localStorage.setItem('token', data.token);
        
        // Redirect to login or home
        alert('Registration successful! Please login.');
        navigate('/login');
        
      } catch (err) {
        console.error('Registration error:', err);
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--light-bg)' }}>
      
      <section style={{ flex: '1', padding: '40px 20px', maxWidth: '550px', margin: 'auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/picture/badmintonLogo.jpg" alt="Logo" style={{ width: '130px', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
            <h2 style={{ color: 'var(--text-color)', marginTop: '15px' }}>Join the Community</h2>
            <p style={{ color: 'var(--text-color)', opacity: '0.8' }}>Get weekly drills and equipment discounts!</p>
        </div>

        <div className="form-container" style={{ 
          background: 'var(--card-bg)', 
          padding: '40px',
          borderRadius: '15px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          color: 'var(--text-color)' 
        }}>
          {apiError && (
            <div style={{ background: '#ff4444', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Full Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input-large" placeholder="Enter your full name" />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Email Address:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input-large" placeholder="example@email.com" />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Date of Birth:</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input-large" />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input-large" placeholder="At least 6 characters" />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Confirm Password:</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-input-large" placeholder="Re-type password" />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '25px', marginBottom: '10px' }}>Your Skill Level:</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                <label key={lvl} style={{ cursor: 'pointer', fontSize: '1rem' }}>
                  <input type="radio" name="level" value={lvl} checked={formData.level === lvl} onChange={handleChange} style={{ marginRight: '8px' }} /> {lvl}
                </label>
              ))}
            </div>
            {errors.level && <span className="error-text" style={{ display: 'block' }}>{errors.level}</span>}

            <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label style={{ marginLeft: '12px', fontSize: '0.95rem' }}>I agree to the terms and conditions</label>
            </div>
            {errors.terms && <span className="error-text">{errors.terms}</span>}

            <button type="submit" disabled={loading} style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '15px', 
              border: 'none', 
              borderRadius: '8px', 
              width: '100%', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              marginTop: '30px', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login here</Link></p>
          </div>
        </div>
      </section>

      <footer style={{ 
        background: 'var(--footer-bg)', 
        color: 'white', 
        textAlign: 'center', 
        padding: '15px 0', 
        marginTop: 'auto',
        width: '100%',
        zIndex: '10'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>&copy; 2026 All Rights Reserved. Greshamin Centino</p>
      </footer>

      <style>{`
        .form-input-large {
          width: 100%;
          padding: 12px 15px;
          margin-top: 8px;
          border-radius: 8px;
          border: 1.5px solid #ccc;
          background: var(--light-bg);
          color: var(--text-color);
          box-sizing: border-box;
          font-size: 1rem;
        }
        .form-input-large:focus {
          border-color: var(--primary-color);
          outline: none;
        }
        .error-text {
          color: #ff4d4d;
          font-size: 0.85rem;
          margin-top: 5px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;