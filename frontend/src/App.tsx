import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts and Hooks
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth'; // Required for admin role check

// Components
import ProtectedRoute from './components/ProtectedRoute';
import FloatingCTA from './components/FloatingCTA'; // Assuming this component exists as per feature description

// Pages
import HomePage from './pages/HomePage';
import MembershipsPage from './pages/MembershipsPage';
import SchedulePage from './pages/SchedulePage';
import TrainersPage from './pages/TrainersPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Initialize QueryClient for Tanstack Query
const queryClient = new QueryClient();

// AdminRouteWrapper component to enforce ADMIN role check
// This component is rendered *inside* ProtectedRoute, ensuring authentication first.
const AdminRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth(); // isAuthenticated is guaranteed true by ProtectedRoute

  // If authentication status is still loading (should be handled by ProtectedRoute, but as a safeguard)
  if (isLoading) {
    return <div>Loading user roles...</div>;
  }

  // If user is authenticated but does not have the 'ADMIN' role, redirect to home
  if (!user || !user.roles.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the 'ADMIN' role, render children
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/memberships" element={<MembershipsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected User Routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*" // Matches /admin and any sub-paths like /admin/memberships
              element={
                <ProtectedRoute> {/* First, ensure the user is authenticated */}
                  <AdminRouteWrapper> {/* Then, ensure the authenticated user has the 'ADMIN' role */}
                    <AdminDashboardPage />
                  </AdminRouteWrapper>
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* FloatingCTA is rendered globally, outside the routing structure */}
          <FloatingCTA />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;