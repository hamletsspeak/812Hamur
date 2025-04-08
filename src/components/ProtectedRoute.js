import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== '/profile') {
    return <Navigate to="/profile" />;
  }

  return children;
}

export default ProtectedRoute;