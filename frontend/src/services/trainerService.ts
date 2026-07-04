import { apiClient } from '@/api/client';
import { Trainer, CreateTrainerData } from '@/types/trainer';

export async function getTrainers(): Promise<Trainer[]> {
  try {
    const response = await apiClient.get<Trainer[]>('/api/v1/trainers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trainers:', error);
    throw error;
  }
}

export async function createTrainer(data: CreateTrainerData): Promise<Trainer> {
  try {
    const response = await apiClient.post<Trainer>('/api/v1/admin/trainers', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create trainer:', error);
    throw error;
  }
}
