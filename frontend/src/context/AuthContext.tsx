import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login as authServiceLogin } from '../services/authService';
import { AuthResponse, LoginCredentials } from '../types/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // For this admin-focused feature, if a token exists, we assume the user is an admin.
      // The instruction allows "assuming admin if token exists for this feature's scope".
      setIsAdmin(true);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response: AuthResponse = await authServiceLogin(credentials);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setIsAuthenticated(true);
      setIsAdmin(response.role === 'ADMIN');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/login');
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isAdmin,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };