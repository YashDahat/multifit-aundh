// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ClassScheduleDto } from '@/types/schedule';

export const getAllClassSchedules = async (): Promise<ClassScheduleDto[]> => {
  const response = await apiClient.get<ClassScheduleDto[]>('/api/v1/schedules');
  return response.data;
};

export const getClassScheduleById = async (id: string): Promise<ClassScheduleDto> => {
  const response = await apiClient.get<ClassScheduleDto>(`/api/v1/schedules/${id}`);
  return response.data;
};

export const getClassSchedulesByDateRange = async (): Promise<ClassScheduleDto[]> => {
  const response = await apiClient.get<ClassScheduleDto[]>('/api/v1/schedules/date-range');
  return response.data;
};

export const adminGetAllClassSchedules = async (): Promise<ClassScheduleDto[]> => {
  const response = await apiClient.get<ClassScheduleDto[]>('/api/v1/admin/schedules');
  return response.data;
};

export const adminGetClassScheduleById = async (id: string): Promise<ClassScheduleDto> => {
  const response = await apiClient.get<ClassScheduleDto>(`/api/v1/admin/schedules/${id}`);
  return response.data;
};

export const createClassSchedule = async (request: ClassScheduleDto): Promise<ClassScheduleDto> => {
  const response = await apiClient.post<ClassScheduleDto>('/api/v1/admin/schedules', request);
  return response.data;
};

export const updateClassSchedule = async (id: string, request: ClassScheduleDto): Promise<ClassScheduleDto> => {
  const response = await apiClient.put<ClassScheduleDto>(`/api/v1/admin/schedules/${id}`, request);
  return response.data;
};

export const deleteClassSchedule = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/schedules/${id}`);
};

