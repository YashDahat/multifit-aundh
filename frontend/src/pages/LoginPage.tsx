import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import Layout from '@/components/Layout';

// Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  }
    = useForm<LoginFormInputs>({
      resolver: zodResolver(loginSchema),
    });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage(null); // Clear previous errors
    try {
      await login(data);
      navigate('/admin/dashboard');
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#333333] rounded-xl shadow-lg p-8 md:p-10 max-w-md w-full mx-auto">
          <h1 className="text-[#F5F5F5] text-3xl font-bold text-center mb-6">
            Welcome to MultiFit Aundh Admin
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="text-[#F5F5F5] text-sm font-medium mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="bg-gray-700 text-[#F5F5F5] border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                placeholder="admin@multifit.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[#F5F5F5] text-sm font-medium mb-2 block"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-gray-700 text-[#F5F5F5] border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>
              )}
            </div>

            {errorMessage && <p className="text-red-400 text-sm mt-2">{errorMessage}</p>}

            <div>
              <button
                type="submit"
                className="bg-[#DFFF00] text-[#1A1A1A] font-bold py-3 px-6 rounded-md w-full hover:bg-opacity-90 transition-all duration-200"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;