import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrialLead, getTrialLeads } from '../services/trialLeadService';
import { TrialLead, CreateTrialLeadRequest } from '../types/trial';

export const useTrialLeads = () => {
  return useQuery<TrialLead[], Error>({
    queryKey: ['trialLeads'],
    queryFn: getTrialLeads,
  });
};

export const useCreateTrialLead = () => {
  const queryClient = useQueryClient();
  return useMutation<TrialLead, Error, CreateTrialLeadRequest>({
    mutationFn: createTrialLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trialLeads'] });
    },
  });
};