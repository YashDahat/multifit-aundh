import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface TrialLeadDto {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  submissionDate: string;
}

const fetchLeads = async (): Promise<TrialLeadDto[]> => {
  const response = await apiClient.get<TrialLeadDto[]>('/api/v1/leads/trial');
  return response.data;
};

export const useAdminLeads = (): UseQueryResult<TrialLeadDto[]> => {
  return useQuery<TrialLeadDto[]>({
    queryKey: ['adminLeads'],
    queryFn: fetchLeads,
  });
};
