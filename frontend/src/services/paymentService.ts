// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { Payment, PaymentOrderResponse } from '@/types/payment';

export const initiatePayment = async (request: unknown): Promise<PaymentOrderResponse> => {
  const response = await apiClient.post<PaymentOrderResponse>('/api/v1/payments/initiate', request);
  return response.data;
};

export const handlePaymentCallback = async (request: unknown): Promise<Payment> => {
  const response = await apiClient.post<Payment>('/api/v1/payments/callback', request);
  return response.data;
};

