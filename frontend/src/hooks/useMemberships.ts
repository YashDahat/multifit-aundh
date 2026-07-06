import { useQuery } from '@tanstack/react-query';
import { getAllMemberships, getMembershipById } from '../services/membershipService';
import type { MembershipDto } from '../types/membership';

export const useAllMemberships = () => {
  return useQuery<MembershipDto[]>({
    queryKey: ['memberships'],
    queryFn: getAllMemberships,
  });
};

export const useMembership = (id: string) => {
  return useQuery<MembershipDto>({
    queryKey: ['membership', id],
    queryFn: () => getMembershipById(id),
    enabled: !!id,
  });
};