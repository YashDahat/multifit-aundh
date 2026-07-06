import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, userRole, allowedRoles, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  if (!isAuthenticated || (allowedRoles && userRole && !allowedRoles.includes(userRole))) {
    return null; // Or a more elaborate unauthorized message if desired, but redirection handles it.
  }

  return <>{children}</>;
};

export default ProtectedRoute;