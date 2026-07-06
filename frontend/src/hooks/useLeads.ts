import { useMutation } from '@tanstack/react-query';
import { submitTrialLead } from '../services/leadService';
import type { CreateTrialLeadRequest, TrialLead } from '../types/lead';

export const useSubmitTrialLead = () => {
  return useMutation<TrialLead, Error, CreateTrialLeadRequest>({
    mutationFn: submitTrialLead,
    onSuccess: (data) => {
      console.log('Trial lead submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting trial lead:', error);
    },
  });
};