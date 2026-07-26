// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface CreatePaymentRequest {
  amount: number | null;
  currency: string | null;
  referenceId: string | null;
}

export interface PaymentOrderResponse {
  gatewayOrderId: string | null;
  gatewayKeyId: string | null;
  amount: number | null;
  currency: string | null;
  paymentRecordId: number | null;
}

export interface PaymentVerificationResponse {
  verified: boolean | null;
  status: string | null;
  referenceId: string | null;
}

