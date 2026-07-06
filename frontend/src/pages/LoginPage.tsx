import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '@/components/Layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // Redirection handled by useEffect after isAuthenticated updates
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  if (isAuthenticated) {
    return null; // Or a loading spinner, as the redirect will happen shortly
  }

  return (
    <Layout>
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative bg-[#1A1A1A] rounded-xl shadow-lg p-8 md:p-12 max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-[#DFFF00] mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-[#F5F5F5] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-[#333333] text-[#F5F5F5] border border-[#333333] focus:border-[#DFFF00] rounded-md px-4 py-3 w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-[#F5F5F5] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-[#333333] text-[#F5F5F5] border border-[#333333] focus:border-[#DFFF00] rounded-md px-4 py-3 w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold py-3 px-6 rounded-md w-full transition-all duration-200"
            >
              Login
            </button>
          </form>
          <p className="text-center text-[#F5F5F5] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#DFFF00] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;