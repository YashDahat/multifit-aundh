import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, AuthResponse } from '../types/auth';
import * as authService from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // As per instruction: "assume token presence implies authentication and user info can be derived or fetched later"
      // For simplicity, we set a placeholder user if a token is present on initial load.
      // A more robust solution might involve decoding the token or making an API call to fetch user details.
      setUser({ email: 'authenticated@example.com' });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.authenticateUser({ email, password });
      localStorage.setItem('token', response.token ?? '');
      setToken(response.token);
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.registerUser({ email, password });
      localStorage.setItem('token', response.token ?? '');
      setToken(response.token ?? '');
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    userRole: user?.roles?.[0] ?? null,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// This hook is intended to be implemented in frontend/src/hooks/useAuth.ts
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };