// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ClassBookingDto, CreateGymClassRequest, GymClassDto, UpdateGymClassRequest } from '@/types/gymClass';

export const getGymClassesByDate = async (): Promise<GymClassDto[]> => {
  const response = await apiClient.get<GymClassDto[]>('/api/v1/classes/date');
  return response.data;
};

export const getWeeklySchedule = async (): Promise<GymClassDto[]> => {
  const response = await apiClient.get<GymClassDto[]>('/api/v1/classes/weekly');
  return response.data;
};

export const getGymClassById = async (classId: string): Promise<GymClassDto> => {
  const response = await apiClient.get<GymClassDto>(`/api/v1/classes/${classId}`);
  return response.data;
};

export const getUserBookings = async (): Promise<ClassBookingDto[]> => {
  const response = await apiClient.get<ClassBookingDto[]>('/api/v1/bookings/my-bookings');
  return response.data;
};

export const createGymClass = async (request: CreateGymClassRequest): Promise<GymClassDto> => {
  const response = await apiClient.post<GymClassDto>('/api/v1/admin/classes', request);
  return response.data;
};

export const updateGymClass = async (classId: string, request: UpdateGymClassRequest): Promise<GymClassDto> => {
  const response = await apiClient.put<GymClassDto>(`/api/v1/admin/classes/${classId}`, request);
  return response.data;
};

