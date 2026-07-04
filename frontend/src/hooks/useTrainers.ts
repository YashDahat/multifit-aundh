import { useQuery } from 'react-query';
import { Trainer } from '../types/trainer';
import { getTrainers } from '../services/trainerService';

export const useTrainers = () => {
  const { data, isLoading, isError, error } = useQuery<Trainer[], Error>(
    ['trainers'],
    getTrainers
  );

  return {
    data,
    isLoading,
    isError,
    error,
  };
};