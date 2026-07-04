import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as authServiceLogin } from '../services/authService';
import { LoginCredentials, AuthResponse } from '../types/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { role: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      // As per instruction: "assuming only admin users log in via this flow for now,
      // or decode role from token if available, but for simplicity, assume admin if token exists."
      setUser({ role: 'admin' });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response: AuthResponse = await authServiceLogin(credentials);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser({ role: response.role });
    } catch (error) {
      throw error; // Re-throw for the calling component to catch
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};