// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { CreatePaymentRequest, PaymentOrderResponse, PaymentVerificationResponse } from '@/types/payment';
import type { VerifyPaymentRequest } from '@/types/verify';

export const createOrder = async (request: CreatePaymentRequest): Promise<PaymentOrderResponse> => {
  const response = await apiClient.post<PaymentOrderResponse>('/api/v1/payments/create-order', request);
  return response.data;
};

export const verify = async (request: VerifyPaymentRequest): Promise<PaymentVerificationResponse> => {
  const response = await apiClient.post<PaymentVerificationResponse>('/api/v1/payments/verify', request);
  return response.data;
};

export const webhook = async (request: unknown): Promise<unknown> => {
  const response = await apiClient.post<unknown>('/api/v1/payments/webhook', request);
  return response.data;
};

