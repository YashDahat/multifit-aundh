// Assembled from routes.ts by the route registry — re-derived every attempt.
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './cart/CartContext'

import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import MembershipsPage from './pages/MembershipsPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import SchedulePage from './pages/SchedulePage';
import TrainerDetailPage from './pages/TrainerDetailPage';
import TrainersPage from './pages/TrainersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMembershipsPage from './pages/AdminMembershipsPage';
import AdminSchedulingPage from './pages/AdminSchedulingPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminTrainersPage from './pages/AdminTrainersPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/memberships" element={<MembershipsPage />} />
              <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/trainer/:id" element={<TrainerDetailPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/memberships" element={<ProtectedRoute><AdminMembershipsPage /></ProtectedRoute>} />
              <Route path="/admin/scheduling" element={<ProtectedRoute><AdminSchedulingPage /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonialsPage /></ProtectedRoute>} />
              <Route path="/admin/trainers" element={<ProtectedRoute><AdminTrainersPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
