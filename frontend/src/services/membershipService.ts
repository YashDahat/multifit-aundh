// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { MembershipDto } from '@/types/membership';

export const getAllMemberships = async (): Promise<MembershipDto[]> => {
  const response = await apiClient.get<MembershipDto[]>('/api/v1/memberships');
  return response.data;
};

export const getMembershipById = async (id: string): Promise<MembershipDto> => {
  const response = await apiClient.get<MembershipDto>(`/api/v1/memberships/${id}`);
  return response.data;
};

export const createMembership = async (request: MembershipDto): Promise<MembershipDto> => {
  const response = await apiClient.post<MembershipDto>('/api/v1/admin/memberships', request);
  return response.data;
};

export const updateMembership = async (id: string, request: MembershipDto): Promise<MembershipDto> => {
  const response = await apiClient.put<MembershipDto>(`/api/v1/admin/memberships/${id}`, request);
  return response.data;
};

export const deleteMembership = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/memberships/${id}`);
};

