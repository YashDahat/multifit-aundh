import { useQuery } from '@tanstack/react-query';
import { getMembershipPlans } from '../services/membershipService';
import { MembershipPlan } from '../types/membership';

export const useMemberships = () => {
  const { data, isLoading, isError, error } = useQuery<MembershipPlan[], Error>({
    queryKey: ['memberships'],
    queryFn: getMembershipPlans,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};