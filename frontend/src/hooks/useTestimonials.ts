import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface TestimonialDto {
  id: string;
  author: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface CreateTestimonialRequest {
  author: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface UpdateTestimonialRequest {
  id: string;
  author: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const fetchTestimonials = async (): Promise<TestimonialDto[]> => {
  const response = await apiClient.get<TestimonialDto[]>('/api/v1/testimonials');
  return response.data;
};

export const useAdminTestimonials = (): UseQueryResult<TestimonialDto[]> => {
  return useQuery<TestimonialDto[]>({
    queryKey: ['adminTestimonials'],
    queryFn: fetchTestimonials,
  });
};

export const useCreateTestimonial = (): UseMutationResult<TestimonialDto, Error, CreateTestimonialRequest> => {
  return useMutation<TestimonialDto, Error, CreateTestimonialRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<TestimonialDto>('/api/v1/testimonials', data);
      return response.data;
    },
  });
};

export const useUpdateTestimonial = (): UseMutationResult<TestimonialDto, Error, UpdateTestimonialRequest> => {
  return useMutation<TestimonialDto, Error, UpdateTestimonialRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.put<TestimonialDto>(`/api/v1/testimonials/${data.id}`, data);
      return response.data;
    },
  });
};

export const useDeleteTestimonial = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/testimonials/${id}`);
    },
  });
};
