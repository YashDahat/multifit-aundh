import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getSchedule, createBooking } from '../services/scheduleService';
import { Schedule, Booking } from '../types/schedule';

export function useSchedule(): UseQueryResult<Schedule[]> {
  return useQuery<Schedule[], Error>({
    queryKey: ['schedule'],
    queryFn: getSchedule,
  });
}

export function useCreateBooking(): UseMutationResult<Booking, Error, string> {
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, string>({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}