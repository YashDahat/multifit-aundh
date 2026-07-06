// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { TrainerDto } from '@/types/trainer';
import type { TestimonialDto } from '@/types/testimonial';

export const getAllTrainers = async (): Promise<TrainerDto[]> => {
  const response = await apiClient.get<TrainerDto[]>('/api/v1/content/trainers');
  return response.data;
};

export const getTrainerById = async (id: string): Promise<TrainerDto> => {
  const response = await apiClient.get<TrainerDto>(`/api/v1/content/trainers/${id}`);
  return response.data;
};

export const getAllTestimonials = async (): Promise<TestimonialDto[]> => {
  const response = await apiClient.get<TestimonialDto[]>('/api/v1/content/testimonials');
  return response.data;
};

export const getTestimonialById = async (id: string): Promise<TestimonialDto> => {
  const response = await apiClient.get<TestimonialDto>(`/api/v1/content/testimonials/${id}`);
  return response.data;
};

export const createTrainer = async (request: TrainerDto): Promise<TrainerDto> => {
  const response = await apiClient.post<TrainerDto>('/api/v1/admin/content/trainers', request);
  return response.data;
};

export const updateTrainer = async (id: string, request: TrainerDto): Promise<TrainerDto> => {
  const response = await apiClient.put<TrainerDto>(`/api/v1/admin/content/trainers/${id}`, request);
  return response.data;
};

export const deleteTrainer = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/content/trainers/${id}`);
};

export const createTestimonial = async (request: TestimonialDto): Promise<TestimonialDto> => {
  const response = await apiClient.post<TestimonialDto>('/api/v1/admin/content/testimonials', request);
  return response.data;
};

export const updateTestimonial = async (id: string, request: TestimonialDto): Promise<TestimonialDto> => {
  const response = await apiClient.put<TestimonialDto>(`/api/v1/admin/content/testimonials/${id}`, request);
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/content/testimonials/${id}`);
};

