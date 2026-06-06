import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice.js';
import { ROLES } from '../../../../backend/src/constants/roles.js'; // Can fallback if backend import is not clean
import toast from 'react-hot-toast';
import Loader from '../Loader.jsx';

const AdminRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  const isAdminRole = user?.role === 'Admin' || user?.role === 'Super Admin';

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdminRole) {
      toast.error('Access denied. Admin permissions required.');
    }
  }, [isLoading, isAuthenticated, isAdminRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdminRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
