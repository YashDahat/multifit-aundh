import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../services/bookingService';

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyGymClasses'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
    onError: (error) => {
      console.error("Failed to cancel booking:", error);
    },
  });
};