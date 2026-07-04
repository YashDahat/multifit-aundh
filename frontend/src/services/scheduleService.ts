import apiClient from '../api/client';
import { Schedule, Booking } from '../types/schedule';

export async function getSchedule(): Promise<Schedule[]> {
  const response = await apiClient.get<Schedule[]>('/api/v1/schedule');
  return response.data;
}

export async function createBooking(scheduleId: string): Promise<Booking> {
  const response = await apiClient.post<Booking>('/api/v1/bookings', { scheduleId });
  return response.data;
}