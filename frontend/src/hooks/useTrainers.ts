import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getTrainers } from '../services/trainerService';
import { Trainer } from '../types/trainer';

export const useTrainers = (): UseQueryResult<Trainer[]> => {
  return useQuery<Trainer[]>({
    queryKey: ['trainers'],
    queryFn: getTrainers,
  });
};