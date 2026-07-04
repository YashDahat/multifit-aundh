import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getTrainers, createTrainer } from '@/services/trainerService';
import { Trainer, CreateTrainerData } from '@/types/trainer';

export const useTrainers = (): UseQueryResult<Trainer[], Error> => {
  return useQuery<Trainer[], Error>({
    queryKey: ['trainers'],
    queryFn: getTrainers,
  });
};

export const useCreateTrainer = (): UseMutationResult<Trainer, Error, CreateTrainerData> => {
  const queryClient = useQueryClient();
  return useMutation<Trainer, Error, CreateTrainerData>({
    mutationFn: createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });
};