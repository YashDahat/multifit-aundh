import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGymClassesByDate,
  getWeeklySchedule,
  getGymClassById,
  getUserBookings,
  createGymClass,
  updateGymClass,
} from '@/services/gymClassService';
import type { CreateGymClassRequest, UpdateGymClassRequest } from '@/types/gymClass';

export const useGymClassesByDate = () => {
  return useQuery({
    queryKey: ['gymClasses', 'byDate'],
    queryFn: getGymClassesByDate,
  });
};

export const useWeeklyGymClasses = () => {
  return useQuery({
    queryKey: ['gymClasses', 'weeklySchedule'],
    queryFn: getWeeklySchedule,
  });
};

export const useGymClass = (classId: string) => {
  return useQuery({
    queryKey: ['gymClasses', classId],
    queryFn: () => getGymClassById(classId),
    enabled: !!classId,
  });
};

export const useUserBookings = () => {
  return useQuery({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
  });
};

export const useCreateGymClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateGymClassRequest) => createGymClass(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gymClasses'] });
      queryClient.invalidateQueries({ queryKey: ['gymClasses', 'weeklySchedule'] });
      queryClient.invalidateQueries({ queryKey: ['gymClasses', 'byDate'] });
    },
  });
};

export const useUpdateGymClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, request }: { classId: string; request: UpdateGymClassRequest }) =>
      updateGymClass(classId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gymClasses'] });
      queryClient.invalidateQueries({ queryKey: ['gymClasses', 'weeklySchedule'] });
      queryClient.invalidateQueries({ queryKey: ['gymClasses', 'byDate'] });
      queryClient.invalidateQueries({ queryKey: ['gymClasses', variables.classId] });
    },
  });
};