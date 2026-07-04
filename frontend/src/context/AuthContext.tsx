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

export const AuthProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // As per instruction: "if the role within the token (if applicable, otherwise assume admin for this admin-focused feature) is 'ADMIN'"
      // Since there's no explicit token decoding utility, we assume admin if a token is present for this admin-focused feature.
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
      router.push('/admin');
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
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

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext };