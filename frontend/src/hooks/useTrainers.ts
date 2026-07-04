import { useQuery } from '@tanstack/react-query';
import { Trainer } from '../types/trainer';
import { getTrainers } from '../services/trainerService';

export const useTrainers = () => {
  const { data, isLoading, isError, error } = useQuery<Trainer[], Error>({
    queryKey: ['trainers'],
    queryFn: getTrainers,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};