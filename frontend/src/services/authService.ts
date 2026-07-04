import apiClient from '../api/client';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
  return response.data;
};