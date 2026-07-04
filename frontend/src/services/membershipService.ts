import apiClient from '../api/client';
import { MembershipPlan } from '../types/membership';

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await apiClient.get<MembershipPlan[]>('/api/v1/memberships');
  return response.data;
};