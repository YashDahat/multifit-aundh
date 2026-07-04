import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as adminTrainerService from '@/services/adminTrainerService';
import { Trainer } from '@/types/trainer';

export const useAdminTrainers = () => {
  const queryClient = useQueryClient();

  const getAllTrainers: UseQueryResult<Trainer[]> = useQuery({
    queryKey: ['adminTrainers'],
    queryFn: adminTrainerService.getAllTrainers,
  });

  const createTrainer: UseMutationResult<Trainer, Error, Omit<Trainer, 'id'>> = useMutation({
    mutationFn: adminTrainerService.createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainers'] });
    },
  });

  const updateTrainer: UseMutationResult<Trainer, Error, { id: string; trainer: Omit<Trainer, 'id'> }> = useMutation({
    mutationFn: ({ id, trainer }) => adminTrainerService.updateTrainer(id, trainer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainers'] });
    },
  });

  const deleteTrainer: UseMutationResult<void, Error, string> = useMutation({
    mutationFn: adminTrainerService.deleteTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainers'] });
    },
  });

  return {
    getAllTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,
  };
};