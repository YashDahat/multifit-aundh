import { apiClient } from '../../api/client';
import { Trainer } from '../types/trainer';

export const getAllTrainers = async (): Promise<Trainer[]> => {
  const response = await apiClient.get<Trainer[]>('/trainers');
  return response.data;
};

export const createTrainer = async (trainer: Omit<Trainer, 'id'>): Promise<Trainer> => {
  const response = await apiClient.post<Trainer>('/admin/trainers', trainer);
  return response.data;
};

export const updateTrainer = async (id: string, trainer: Omit<Trainer, 'id'>): Promise<Trainer> => {
  const response = await apiClient.put<Trainer>(`/admin/trainers/${id}`, trainer);
  return response.data;
};

export const deleteTrainer = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/trainers/${id}`);
};