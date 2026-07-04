import apiClient from '@/api/client';
import { Testimonial, TrialLead, CreateTrialLead } from '@/types/marketing';

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await apiClient.get<Testimonial[]>('/api/v1/testimonials');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function submitTrialLead(leadData: CreateTrialLead): Promise<TrialLead> {
  try {
    const response = await apiClient.post<TrialLead>('/api/v1/leads/trial', leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
}