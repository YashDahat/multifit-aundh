import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAllTrainers, getTrainerById } from '../services/contentService';
import type { TrainerDto } from '../types/trainer';

export const useAllTrainers = (): UseQueryResult<TrainerDto[], Error> => {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });
};

export const useTrainer = (id: string): UseQueryResult<TrainerDto, Error> => {
  return useQuery({
    queryKey: ['trainer', id],
    queryFn: () => getTrainerById(id),
    enabled: !!id,
  });
};