import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMembershipPlans } from '../services/membershipService';
import type { MembershipPlan } from '../types/membership';

export const useMembershipPlans = (): UseQueryResult<MembershipPlan[]> => {
  return useQuery({
    queryKey: ['membershipPlans'],
    queryFn: getMembershipPlans,
  });
};