import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { getTrainers } from '../services/trainerService';
import { Trainer } from '../types/trainer';

export const useTrainers = (): UseQueryResult<Trainer[]> => {
  return useQuery<Trainer[]>({
    queryKey: ['trainers'],
    queryFn: getTrainers,
  });
};

export const useAdminTrainers = (): UseQueryResult<Trainer[]> => {
  return useQuery<Trainer[]>({
    queryKey: ['adminTrainers'],
    queryFn: getTrainers,
  });
};

interface CreateTrainerRequest {
  name: string;
  specialization: string;
  description?: string;
}

interface UpdateTrainerRequest {
  id: string;
  name: string;
  specialization: string;
  description?: string;
}

export const useCreateTrainer = (): UseMutationResult<Trainer, Error, CreateTrainerRequest> => {
  return useMutation<Trainer, Error, CreateTrainerRequest>({
    mutationFn: async (data: CreateTrainerRequest) => {
      const response = await apiClient.post<Trainer>('/api/v1/trainers', data);
      return response.data;
    },
  });
};

export const useUpdateTrainer = (): UseMutationResult<Trainer, Error, UpdateTrainerRequest> => {
  return useMutation<Trainer, Error, UpdateTrainerRequest>({
    mutationFn: async (data: UpdateTrainerRequest) => {
      const response = await apiClient.put<Trainer>(`/api/v1/trainers/${data.id}`, data);
      return response.data;
    },
  });
};

export const useDeleteTrainer = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/trainers/${id}`);
    },
  });
};
