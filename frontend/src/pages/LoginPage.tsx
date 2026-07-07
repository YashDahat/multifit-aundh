import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to home page on successful login
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await login(email, password);
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-[#F5F5F5] px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Potential. Log In.</h1>
          <p className="text-xl md:text-2xl">Access your personalized fitness journey.</p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-gray-800">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#DFFF00] hover:underline transition-all duration-200">
                Register here.
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;