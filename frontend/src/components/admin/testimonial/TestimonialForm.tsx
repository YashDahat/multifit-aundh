'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TestimonialDto } from '@/types/content';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTestimonial, updateTestimonial } from '@/services/testimonialService';
import { toast } from 'sonner';

const testimonialFormSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().min(1, 'Author name is required'),
  rating: z.coerce.number().min(1).max(5, 'Rating must be between 1 and 5'),
  content: z.string().min(1, 'Content is required'),
  displayDate: z.string().min(1, 'Display date is required'),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface TestimonialFormProps {
  initialData?: TestimonialDto;
  onSuccess?: () => void;
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      id: initialData?.id || '',
      authorName: initialData?.authorName || '',
      rating: initialData?.rating || 1,
      content: initialData?.content || '',
      displayDate: initialData?.displayDate || new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id ?? '',
        authorName: initialData.authorName ?? '',
        rating: initialData.rating ?? 1,
        content: initialData.content ?? '',
        displayDate: initialData.displayDate ?? new Date().toISOString().split('T')[0],
      });
    } else {
      form.reset({
        id: '',
        authorName: '',
        rating: 1,
        content: '',
        displayDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, form]);

  const createMutation = useMutation({
    mutationFn: (data: TestimonialDto) => createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully!');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to create testimonial: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TestimonialDto) =>
      updateTestimonial(data.id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully!');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    },
  });

  const onSubmit = (values: TestimonialFormValues) => {
    const testimonialDto: TestimonialDto = {
      id: values.id || null,
      authorName: values.authorName,
      rating: values.rating,
      content: values.content,
      displayDate: values.displayDate,
    };

    if (initialData?.id) {
      updateMutation.mutate(testimonialDto);
    } else {
      createMutation.mutate(testimonialDto);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="This gym is amazing!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#DFFF00] hover:bg-[#c7e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {initialData ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </form>
    </Form>
  );
};