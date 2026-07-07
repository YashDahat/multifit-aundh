// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TrialLeadDto } from '@/types/lead';

export const submitTrialLead = async (request: TrialLeadDto): Promise<TrialLeadDto> => {
  const response = await apiClient.post<TrialLeadDto>('/api/v1/leads/trial', request);
  return response.data;
};

export const getAllTrialLeads = async (): Promise<TrialLeadDto[]> => {
  const response = await apiClient.get<TrialLeadDto[]>('/api/v1/admin/leads/trial');
  return response.data;
};

export const getTrialLeadById = async (id: string): Promise<TrialLeadDto> => {
  const response = await apiClient.get<TrialLeadDto>(`/api/v1/admin/leads/trial/${id}`);
  return response.data;
};

