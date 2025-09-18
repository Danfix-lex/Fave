import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requireKYC = false }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireKYC && !userProfile?.is_kyc_complete) {
    return <Navigate to="/kyc" replace />;
  }

  return children;
};

export default ProtectedRoute;