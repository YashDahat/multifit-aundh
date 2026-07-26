import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAllTrainers,
  getTrainerById,
  getAllTestimonials,
  submitTrialLead,
} from '@/services/apiService'; // Assuming apiService exports these
import { TrainerDto, TestimonialDto, TrialLeadDto } from '@/types/content';
import { toast } from 'sonner';

export const useContent = () => {
  const trainersQuery = useQuery<TrainerDto[]>({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });

  const trainerDetailQuery = (trainerId: string) =>
    useQuery<TrainerDto>({
      queryKey: ['trainer', trainerId],
      queryFn: () => getTrainerById(trainerId),
      enabled: !!trainerId,
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
    trainerDetailQuery,
    testimonialsQuery,
    trialLeadMutation,
  };
};