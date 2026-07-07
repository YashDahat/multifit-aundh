// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TrainerDto } from '@/types/trainer';

export const getAllTrainers = async (): Promise<TrainerDto[]> => {
  const response = await apiClient.get<TrainerDto[]>('/api/v1/admin/trainers');
  return response.data;
};

export const getTrainerById = async (id: string): Promise<TrainerDto> => {
  const response = await apiClient.get<TrainerDto>(`/api/v1/admin/trainers/${id}`);
  return response.data;
};

export const createTrainer = async (request: TrainerDto): Promise<TrainerDto> => {
  const response = await apiClient.post<TrainerDto>('/api/v1/admin/trainers', request);
  return response.data;
};

export const updateTrainer = async (id: string, request: TrainerDto): Promise<TrainerDto> => {
  const response = await apiClient.put<TrainerDto>(`/api/v1/admin/trainers/${id}`, request);
  return response.data;
};

export const deleteTrainer = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/trainers/${id}`);
};

