// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { AuthRequest, AuthResponse } from '@/types/auth';

export const registerUser = async (request: AuthRequest): Promise<void> => {
  await apiClient.post<void>('/api/v1/auth/register', request);
};

export const authenticateUser = async (request: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', request);
  return response.data;
};

