// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { CreateTrialLeadRequest, TrialLead } from '@/types/lead';

export const submitTrialLead = async (request: CreateTrialLeadRequest): Promise<TrialLead> => {
  const response = await apiClient.post<TrialLead>('/api/v1/leads/trial', request);
  return response.data;
};

export const getAllTrialLeads = async (): Promise<TrialLead[]> => {
  const response = await apiClient.get<TrialLead[]>('/api/v1/admin/leads/trial');
  return response.data;
};

