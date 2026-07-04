import { apiClient } from '../api/client';
import { TrialLead, CreateTrialLeadRequest } from '../types/trial';

export const createTrialLead = async (lead: CreateTrialLeadRequest): Promise<TrialLead> => {
  const response = await apiClient.post<TrialLead>('/trials', lead);
  return response.data;
};

export const getTrialLeads = async (): Promise<TrialLead[]> => {
  const response = await apiClient.get<TrialLead[]>('/admin/trials');
  return response.data;
};