// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TrainerDto } from '@/types/trainer';
import type { Testimonial } from '@/types/testimonial';

export const getAllTrainers = async (): Promise<TrainerDto[]> => {
  const response = await apiClient.get<TrainerDto[]>('/api/v1/content/trainers');
  return response.data;
};

export const getTrainerById = async (id: string): Promise<TrainerDto> => {
  const response = await apiClient.get<TrainerDto>(`/api/v1/content/trainers/${id}`);
  return response.data;
};

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await apiClient.get<Testimonial[]>('/api/v1/content/testimonials');
  return response.data;
};

export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const response = await apiClient.get<Testimonial>(`/api/v1/content/testimonials/${id}`);
  return response.data;
};

