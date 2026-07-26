import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookClass, getScheduleForWeek } from '@/services/apiService';
import { ClassScheduleDto } from '@/types/schedule';
import { BookingRequestDto } from '@/types/booking';
import { toast } from 'sonner';

export const useWeeklySchedule = () => {
  return useQuery<ClassScheduleDto[]>({
    queryKey: ['weeklySchedule'],
    queryFn: getScheduleForWeek,
  });
};

export const useBookClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classScheduleId: string) => {
      const request: BookingRequestDto = { classScheduleId };
      return bookClass(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] });
      toast.success('Class booked successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to book class: ${error.message}`);
    },
  });
};