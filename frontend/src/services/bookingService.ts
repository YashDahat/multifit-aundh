// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { BookingDto } from '@/types/booking';

export const createBooking = async (request: unknown): Promise<BookingDto> => {
  const response = await apiClient.post<BookingDto>('/api/v1/bookings', request);
  return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/bookings/${bookingId}`);
};

export const getUserBookings = async (): Promise<BookingDto[]> => {
  const response = await apiClient.get<BookingDto[]>('/api/v1/bookings/my-bookings');
  return response.data;
};

export const getBookingById = async (bookingId: string): Promise<BookingDto> => {
  const response = await apiClient.get<BookingDto>(`/api/v1/bookings/${bookingId}`);
  return response.data;
};

