import { apiClient } from '../api/client';
import { Trainer } from '../types/trainer';

export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await apiClient.get<Trainer[]>('/api/v1/trainers');
  return response.data;
};