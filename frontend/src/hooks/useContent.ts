import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult } from '@tanstack/react-query';
import { getAllTrainers, getTrainerById, getAllTestimonials } from '../services/contentService';
import type { Trainer, Testimonial } from '../types/content';

export const useTrainers = (): QueryObserverResult<Trainer[], Error> => {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });
};

export const useTrainer = (trainerId: string): QueryObserverResult<Trainer, Error> => {
  return useQuery({
    queryKey: ['trainer', trainerId],
    queryFn: () => getTrainerById(trainerId),
    enabled: !!trainerId, // Only run the query if trainerId is available
  });
};

export const useTestimonials = (): QueryObserverResult<Testimonial[], Error> => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials,
  });
};