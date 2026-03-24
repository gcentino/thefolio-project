//backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized — please log in first' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user || req.user.status === 'inactive') {
      return res.status(401).json({ message: 'Account not found or deactivated' });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or has expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied — Admins only' });
};

const memberOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'member' || req.user.role === 'admin'))
    return next();
  return res.status(403).json({ message: 'Access denied — Members only' });
};

module.exports = { protect, adminOnly, memberOrAdmin };