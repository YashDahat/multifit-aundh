import apiClient from '../lib/client';
import { TrialLead, CreateTrialLeadRequest } from '../types/trial';

export const createTrialLead = async (lead: CreateTrialLeadRequest): Promise<TrialLead> => {
  const response = await apiClient.post<TrialLead>('/api/v1/trials', lead);
  return response.data;
};

export const getTrialLeads = async (): Promise<TrialLead[]> => {
  const response = await apiClient.get<TrialLead[]>('/api/v1/admin/trials');
  return response.data;
};