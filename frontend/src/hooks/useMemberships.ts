import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllActiveMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from '@/services/membershipService';
import type { MembershipPlanDto } from '@/types/membership';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { createOrder, verify } from '@/services/paymentService';
import type { CreatePaymentRequest } from '@/types/payment';
import type { VerifyPaymentRequest } from '@/types/verify';

export const useAllMembershipPlans = () => {
  return useQuery({
    queryKey: ['membershipPlans'],
    queryFn: getAllActiveMembershipPlans,
  });
};

export const useMembershipPlan = (id: string) => {
  return useQuery({
    queryKey: ['membershipPlan', id],
    queryFn: () => getMembershipPlanById(id),
    enabled: !!id,
  });
};

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: MembershipPlanDto) => createMembershipPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      toast.success('Membership plan created successfully.');
    },
    onError: (error) => {
      toast.error(`Failed to create membership plan: ${error.message}`);
    },
  });
};

export const useUpdateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: MembershipPlanDto }) =>
      updateMembershipPlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      toast.success('Membership plan updated successfully.');
    },
    onError: (error) => {
      toast.error(`Failed to update membership plan: ${error.message}`);
    },
  });
};

export const useDeleteMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMembershipPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      toast.success('Membership plan deleted successfully.');
    },
    onError: (error) => {
      toast.error(`Failed to delete membership plan: ${error.message}`);
    },
  });
};

export const usePurchaseMembership = () => {
  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: (request: CreatePaymentRequest) => createOrder(request),
    onSuccess: (data) => {
      // This is where you would integrate with a real payment gateway
      // For this project, we'll simulate a successful payment and then verify
      console.log('Payment order created:', data);
      toast.success('Payment order created. Simulating payment...');

      // Simulate payment success and then verify
      const simulatedPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      const simulatedSignature = `sig_${Math.random().toString(36).substring(2, 15)}`;

      verifyPaymentMutation.mutate({
        gatewayOrderId: data.gatewayOrderId ?? '',
        gatewayPaymentId: simulatedPaymentId,
        signature: simulatedSignature,
      });
    },
    onError: (error) => {
      toast.error(`Failed to create payment order: ${error.message}`);
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (request: VerifyPaymentRequest) => verify(request),
    onSuccess: (data) => {
      if (data.verified) {
        toast.success('Payment verified successfully!');
        navigate(ROUTES.PURCHASE_SUCCESS);
      } else {
        toast.error(`Payment verification failed: ${data.status}`);
      }
    },
    onError: (error) => {
      toast.error(`Failed to verify payment: ${error.message}`);
    },
  });

  return {
    purchaseMembership: createOrderMutation.mutate,
    isPending: createOrderMutation.isPending || verifyPaymentMutation.isPending,
  };
};