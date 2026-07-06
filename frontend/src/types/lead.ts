// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface TrialLead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  submissionDate: string | null;
}

export interface CreateTrialLeadRequest {
  name: string | null;
  email: string | null;
  phone: string | null;
}

