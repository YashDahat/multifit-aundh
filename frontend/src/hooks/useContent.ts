import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllTrainers } from '@/services/trainerService';
import { getAllTestimonials } from '@/services/testimonialService';
import { submitTrialLead } from '@/services/trial-leadService';
import { getAllGymClasses } from '@/services/apiService';
import { TrainerDto, TestimonialDto, TrialLeadDto } from '@/types/content';
import { GymClassDto } from '@/types/gym';
import { toast } from 'sonner';

export const useContent = () => {
  const trainersQuery = useQuery<TrainerDto[]>({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });

  const testimonialsQuery = useQuery<TestimonialDto[]>({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials,
  });

  const trialLeadMutation = useMutation({
    mutationFn: (data: TrialLeadDto) => submitTrialLead(data),
    onSuccess: () => {
      toast.success('Trial lead submitted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to submit trial lead: ${error.message}`);
    },
  });

  return {
    trainersQuery,
    testimonialsQuery,
    trialLeadMutation,
  };
};

export const useAllGymClasses = () => {
  return useQuery<GymClassDto[]>({
    queryKey: ['gymClasses'],
    queryFn: getAllGymClasses,
  });
};