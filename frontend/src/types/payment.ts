// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

import type { UserMembership } from '@/types/membership';

export interface PaymentOrderResponse {
  orderId: string | null;
  amount: number | null;
  currency: string | null;
  membershipId: string | null;
  userId: string | null;
}

export interface Payment {
  id: string;
  userMembership: UserMembership | null;
  amount: number | null;
  currency: string | null;
  paymentGatewayOrderId: string | null;
  paymentGatewayTransactionId: string | null;
  status: PaymentStatus | null;
  paymentDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

