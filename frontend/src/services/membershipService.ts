import client from '@/api/client';
import type { MembershipPlan } from '@/types/membership';

/**
 * Fetches all available membership plans from the backend.
 * @returns A promise that resolves to an array of MembershipPlan objects.
 */
export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await client.get<MembershipPlan[]>('/api/v1/memberships/plans');
  return response.data;
};