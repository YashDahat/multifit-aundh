// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface VerifyPaymentRequest {
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  signature: string | null;
}

