import { apiClient } from '../api/client';
import { Trainer } from '../types/trainer';

export const getTrainers = async (): Promise<Trainer[]> => {
  try {
    const response = await apiClient.get<Trainer[]>('/api/v1/trainers');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};