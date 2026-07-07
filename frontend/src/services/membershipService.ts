// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { MembershipPlanDto } from '@/types/membership';

export const getAllActiveMembershipPlans = async (): Promise<MembershipPlanDto[]> => {
  const response = await apiClient.get<MembershipPlanDto[]>('/api/v1/memberships/plans');
  return response.data;
};

export const getMembershipPlanById = async (id: string): Promise<MembershipPlanDto> => {
  const response = await apiClient.get<MembershipPlanDto>(`/api/v1/memberships/plans/${id}`);
  return response.data;
};

export const purchaseMembership = async (planId: string): Promise<unknown> => {
  const response = await apiClient.post<unknown>(`/api/v1/memberships/purchase/${planId}`);
  return response.data;
};

export const getMyActiveMembership = async (): Promise<unknown> => {
  const response = await apiClient.get<unknown>('/api/v1/memberships/my-membership');
  return response.data;
};

export const createMembershipPlan = async (request: MembershipPlanDto): Promise<MembershipPlanDto> => {
  const response = await apiClient.post<MembershipPlanDto>('/api/v1/admin/memberships/plans', request);
  return response.data;
};

export const updateMembershipPlan = async (id: string, request: MembershipPlanDto): Promise<MembershipPlanDto> => {
  const response = await apiClient.put<MembershipPlanDto>(`/api/v1/admin/memberships/plans/${id}`, request);
  return response.data;
};

export const deleteMembershipPlan = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/memberships/plans/${id}`);
};

export const getAllMembershipPlans = async (): Promise<MembershipPlanDto[]> => {
  const response = await apiClient.get<MembershipPlanDto[]>('/api/v1/admin/memberships/plans');
  return response.data;
};

