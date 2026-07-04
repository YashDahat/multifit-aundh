import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth';

// Define the Zod schema for login credentials
const loginSchema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(data);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-[#333333] rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#F5F5F5] text-center mb-6">
          Admin Login for MultiFit Aundh
        </h2>
        <p className="text-[#F5F5F5] text-opacity-80 text-center mb-8">
          Access the MultiFit Aundh management portal.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#F5F5F5] text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-[#F5F5F5] text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md py-3 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </button>

          {isLoading && (
            <p className="text-center mt-4 text-blue-400">Authenticating...</p>
          )}
          {error && (
            <p className="text-center mt-4 text-red-500">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;