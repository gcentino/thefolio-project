import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // 1. Habang chine-check pa kung naka-login (loading), wag muna mag-redirect
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Verifying access...</div>;
  }

  // 2. Kung hindi naka-login, itapon sa login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Kung may specific role na kailangan (hal. admin) at hindi match, itapon sa home
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // 4. Kung pasado sa lahat, ipakita ang page (children)
  return children;
};

export default ProtectedRoute;