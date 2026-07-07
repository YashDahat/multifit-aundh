// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';

export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.post<void>(`/api/v1/bookings/${bookingId}/cancel`);
};

