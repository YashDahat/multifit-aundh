import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult } from '@tanstack/react-query';
import { getAllTrainers, getTrainerById, getAllTestimonials } from '../services/contentService';
import type { TrainerDto } from '../types/trainer';
import type { TestimonialDto } from '../types/testimonial';

export const useTrainers = (): QueryObserverResult<TrainerDto[], Error> => {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });
};

export const useTrainer = (trainerId: string): QueryObserverResult<TrainerDto, Error> => {
  return useQuery({
    queryKey: ['trainer', trainerId],
    queryFn: () => getTrainerById(trainerId),
    enabled: !!trainerId,
  });
};

export const useTestimonials = (): QueryObserverResult<TestimonialDto[], Error> => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials,
  });
};