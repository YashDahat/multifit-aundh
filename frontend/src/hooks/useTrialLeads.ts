import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as trialLeadService from '../services/trialLeadService';
import { CreateTrialLeadRequest, TrialLead } from '../types/trial';

export const useTrialLeads = () => {
  return useQuery<TrialLead[], Error>({
    queryKey: ['trialLeads'],
    queryFn: trialLeadService.getTrialLeads,
  });
};

export const useCreateTrialLead = () => {
  const queryClient = useQueryClient();
  return useMutation<TrialLead, Error, CreateTrialLeadRequest>({
    mutationFn: trialLeadService.createTrialLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trialLeads'] });
    },
  });
};