import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as adminMembershipService from '@/services/adminMembershipService';
import { MembershipPlan } from '@/types/membership';

export const useAdminMemberships = () => {
  const queryClient = useQueryClient();

  const getAllMembershipPlans: UseQueryResult<MembershipPlan[]> = useQuery({
    queryKey: ['adminMemberships'],
    queryFn: adminMembershipService.getAllMembershipPlans,
  });

  const createMembershipPlan: UseMutationResult<MembershipPlan, Error, Omit<MembershipPlan, 'id'>> = useMutation({
    mutationFn: adminMembershipService.createMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMemberships'] });
    },
  });

  const updateMembershipPlan: UseMutationResult<MembershipPlan, Error, { id: string; plan: Omit<MembershipPlan, 'id'> }> = useMutation({
    mutationFn: ({ id, plan }) => adminMembershipService.updateMembershipPlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMemberships'] });
    },
  });

  const deleteMembershipPlan: UseMutationResult<void, Error, string> = useMutation({
    mutationFn: adminMembershipService.deleteMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMemberships'] });
    },
  });

  return {
    getAllMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
  };
};