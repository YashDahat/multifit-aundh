import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllActiveMembershipPlans,
  getMyActiveMembership,
  purchaseMembership,
} from '../services/membershipService';
import type { MembershipPlanDto } from '../types/membership';

export const useAllMembershipPlans = () => {
  return useQuery<MembershipPlanDto[]>({
    queryKey: ['membershipPlans'],
    queryFn: getAllActiveMembershipPlans,
  });
};

export const useUserActiveMembership = () => {
  return useQuery<unknown>({
    queryKey: ['userActiveMembership'],
    queryFn: getMyActiveMembership,
  });
};

export const usePurchaseMembership = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (planId: string) => purchaseMembership(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActiveMembership'] });
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
    },
  });
};