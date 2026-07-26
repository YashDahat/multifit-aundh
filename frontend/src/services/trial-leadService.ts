// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TrialLeadDto } from '@/types/trial';

export const submitTrialLead = async (request: TrialLeadDto): Promise<TrialLeadDto> => {
  const response = await apiClient.post<TrialLeadDto>('/api/v1/trial-leads', request);
  return response.data;
};

