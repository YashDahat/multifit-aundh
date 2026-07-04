export interface TrialLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipInterest?: string;
  submittedAt: string;
}

export interface CreateTrialLeadRequest {
  name: string;
  email: string;
  phone: string;
}