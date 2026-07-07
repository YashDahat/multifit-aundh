import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // Assuming jwt-decode is installed and available

// Define the structure of the user object stored in context
interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

// Define the shape of the AuthContext
interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Helper function to decode JWT and extract user info
  const decodeJwt = useCallback((jwtToken: string): AuthUser | null => {
    try {
      const decoded: any = jwtDecode(jwtToken);
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired');
        return null;
      }
      return {
        id: decoded.sub, // 'sub' is typically the user ID in JWTs
        email: decoded.email,
        roles: decoded.roles || [], // Ensure roles is an array, default to empty
      };
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }, []);

  // Function to check authentication status from localStorage
  const checkAuthStatus = useCallback(() => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedUser = decodeJwt(storedToken);
      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
        setIsAuthenticated(true);
      } else {
        // Token found but invalid/expired, clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [decodeJwt]);

  // Effect to run checkAuthStatus on initial mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.authenticateUser({ email, password });
      const jwtToken = response.jwtToken ?? '';
      if (!jwtToken) throw new Error('No token received.');

      localStorage.setItem('token', jwtToken);
      const decodedUser = decodeJwt(jwtToken);

      if (decodedUser) {
        setToken(jwtToken);
        setUser(decodedUser);
        setIsAuthenticated(true);
        navigate('/'); // Redirect to home page on successful login
      } else {
        // This case should ideally not happen if authService.login returns a valid token
        // but it's a safeguard if decodeJwt fails for some reason
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        throw new Error('Failed to process authentication token.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any potentially stale token on login failure
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw to allow components to handle login errors
    }
  }, [decodeJwt, navigate]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page on logout
  }, [navigate]);

  const contextValue = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for use with useContext in other components
export default AuthContext;