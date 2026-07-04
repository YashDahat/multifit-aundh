import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getTestimonials, submitTrialLead } from '@/services/marketingService';
import { Testimonial, TrialLead, CreateTrialLead } from '@/types/marketing';

export function useTestimonials(): UseQueryResult<Testimonial[]> {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  });
}

export function useSubmitTrialLead(): UseMutationResult<TrialLead, Error, CreateTrialLead> {
  return useMutation({
    mutationFn: submitTrialLead,
  });
}