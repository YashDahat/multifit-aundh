import { useMutation } from '@tanstack/react-query';
import { submitTrialLead } from '../services/leadService';
import type { TrialLeadDto } from '../types/lead';

export const useSubmitTrialLead = () => {
  return useMutation<TrialLeadDto, Error, TrialLeadDto>({
    mutationFn: submitTrialLead,
  });
};