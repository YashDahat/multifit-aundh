import { apiClient } from '@/api/client';
import { Trainer, CreateTrainerData } from '@/types/trainer';

export const getTrainers = async (): Promise<Trainer[]> => {
  try {
    const response = await apiClient.get<Trainer[]>('/api/v1/trainers');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

export const createTrainer = async (data: CreateTrainerData): Promise<Trainer> => {
  try {
    const response = await apiClient.post<Trainer>('/api/v1/admin/trainers', data);
    return response.data;
  } catch (error) {
    console.error('Error creating trainer:', error);
    throw error;
  }
};