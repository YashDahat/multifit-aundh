import { apiClient } from '@/api/client';
import { MembershipPlan } from '@/types/membership';

export const getAllMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await apiClient.get<MembershipPlan[]>('/api/v1/admin/memberships');
  return response.data;
};

export const createMembershipPlan = async (plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> => {
  const response = await apiClient.post<MembershipPlan>('/api/v1/admin/memberships', plan);
  return response.data;
};

export const updateMembershipPlan = async (id: string, plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> => {
  const response = await apiClient.put<MembershipPlan>(`/api/v1/admin/memberships/${id}`, plan);
  return response.data;
};

export const deleteMembershipPlan = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/memberships/${id}`);
};