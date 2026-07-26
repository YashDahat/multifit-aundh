// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TestimonialDto } from '@/types/testimonial';

export const getAllTestimonials = async (): Promise<TestimonialDto[]> => {
  const response = await apiClient.get<TestimonialDto[]>('/api/v1/testimonials');
  return response.data;
};

export const createTestimonial = async (request: TestimonialDto): Promise<TestimonialDto> => {
  const response = await apiClient.post<TestimonialDto>('/api/v1/admin/testimonials', request);
  return response.data;
};

export const updateTestimonial = async (id: string, request: TestimonialDto): Promise<TestimonialDto> => {
  const response = await apiClient.put<TestimonialDto>(`/api/v1/admin/testimonials/${id}`, request);
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/testimonials/${id}`);
};

