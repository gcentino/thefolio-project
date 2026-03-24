// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on load:', token);
    
    if (token) {
      // Set the token in axios headers
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      API.get('/auth/me')
        .then(res => {
          console.log('User loaded:', res.data);
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Error loading user:', err);
          localStorage.removeItem('token');
          delete API.defaults.headers.common['Authorization'];
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      console.log('Login successful:', { token, user });
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers for future requests
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save user to state
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);