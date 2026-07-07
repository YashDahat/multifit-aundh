// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { Testimonial } from '@/types/testimonial';

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await apiClient.get<Testimonial[]>('/api/v1/admin/testimonials');
  return response.data;
};

export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const response = await apiClient.get<Testimonial>(`/api/v1/admin/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (request: Testimonial): Promise<Testimonial> => {
  const response = await apiClient.post<Testimonial>('/api/v1/admin/testimonials', request);
  return response.data;
};

export const updateTestimonial = async (id: string, request: Testimonial): Promise<Testimonial> => {
  const response = await apiClient.put<Testimonial>(`/api/v1/admin/testimonials/${id}`, request);
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/testimonials/${id}`);
};

