// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { GymClassDto } from '@/types/gym';
import type { ClassScheduleDto } from '@/types/schedule';
import type { BookingDto, BookingRequestDto } from '@/types/booking';

export const getAllGymClasses = async (): Promise<GymClassDto[]> => {
  const response = await apiClient.get<GymClassDto[]>('/api/schedule/classes');
  return response.data;
};

export const getGymClassById = async (classId: string): Promise<GymClassDto> => {
  const response = await apiClient.get<GymClassDto>(`/api/schedule/classes/${classId}`);
  return response.data;
};

export const getScheduleForDate = async (): Promise<ClassScheduleDto[]> => {
  const response = await apiClient.get<ClassScheduleDto[]>('/api/schedule/daily');
  return response.data;
};

export const getScheduleForWeek = async (): Promise<ClassScheduleDto[]> => {
  const response = await apiClient.get<ClassScheduleDto[]>('/api/schedule/weekly');
  return response.data;
};

export const bookClass = async (request: BookingRequestDto): Promise<BookingDto> => {
  const response = await apiClient.post<BookingDto>('/api/schedule/book', request);
  return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete<void>(`/api/schedule/cancel/${bookingId}`);
};

export const createGymClass = async (request: GymClassDto): Promise<GymClassDto> => {
  const response = await apiClient.post<GymClassDto>('/api/admin/scheduling/classes', request);
  return response.data;
};

export const updateGymClass = async (classId: string, request: GymClassDto): Promise<GymClassDto> => {
  const response = await apiClient.put<GymClassDto>(`/api/admin/scheduling/classes/${classId}`, request);
  return response.data;
};

export const deleteGymClass = async (classId: string): Promise<void> => {
  await apiClient.delete<void>(`/api/admin/scheduling/classes/${classId}`);
};

export const createClassSchedule = async (request: ClassScheduleDto): Promise<ClassScheduleDto> => {
  const response = await apiClient.post<ClassScheduleDto>('/api/admin/scheduling/schedules', request);
  return response.data;
};

export const updateClassSchedule = async (scheduleId: string, request: ClassScheduleDto): Promise<ClassScheduleDto> => {
  const response = await apiClient.put<ClassScheduleDto>(`/api/admin/scheduling/schedules/${scheduleId}`, request);
  return response.data;
};

export const deleteClassSchedule = async (scheduleId: string): Promise<void> => {
  await apiClient.delete<void>(`/api/admin/scheduling/schedules/${scheduleId}`);
};

