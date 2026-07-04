import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as authServiceLogin } from '../services/authService';
import { LoginCredentials, AuthResponse } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { role: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // Assuming admin role for simplicity if token exists on initial load
      setUser({ role: 'admin' });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response: AuthResponse = await authServiceLogin(credentials);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setIsAuthenticated(true);
      setUser({ role: response.role });
    } catch (error) {
      throw error; // Re-throw for the calling component to handle
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
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

export { AuthContext };
export type { AuthContextType };