// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';

export const bookClass = async (classId: string): Promise<void> => {
  await apiClient.post<void>(`/api/v1/classes/${classId}/book`);
};

export const deleteGymClass = async (classId: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/classes/${classId}`);
};

