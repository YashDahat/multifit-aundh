import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@radix-ui/react-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TestimonialDto } from '@/types/testimonial';
import * as testimonialService from '@/services/testimonialService';
import { FaStar, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import clsx from 'clsx';

const testimonialSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
  quote: z.string().min(1, "Quote is required"),
  imageUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const AdminTestimonialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const { data: testimonials, isLoading, isError } = useQuery<TestimonialDto[]>({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getAllTestimonials,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
  });

  const createMutation = useMutation({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TestimonialDto }) => testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsModalOpen(false);
      reset();
      setEditingTestimonialId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  useEffect(() => {
    if (editingTestimonialId && testimonials) {
      const testimonialToEdit = testimonials.find(t => t.id === editingTestimonialId);
      if (testimonialToEdit) {
        reset(testimonialToEdit);
      }
    } else {
      reset({
        authorName: '',
        quote: '',
        imageUrl: '',
        rating: 1,
      });
    }
  }, [editingTestimonialId, testimonials, reset]);

  const onSubmit = (data: TestimonialFormValues) => {
    if (editingTestimonialId) {
      updateMutation.mutate({ id: editingTestimonialId, data: data as TestimonialDto });
    } else {
      createMutation.mutate(data as TestimonialDto);
    }
  };

  const handleAddTestimonial = () => {
    setEditingTestimonialId(null);
    setIsModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: TestimonialDto) => {
    setEditingTestimonialId(testimonial.id || null);
    setIsModalOpen(true);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={clsx(i < rating ? 'text-yellow-400' : 'text-gray-300')} />
    ));
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#1A1A1A]">Manage Testimonials</h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded transition-all duration-200"
                    onClick={handleAddTestimonial}
                  >
                    <FaPlus className="mr-2" /> Add New Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                  <DialogHeader>
                    <DialogTitle>{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Author Name</label>
                      <Input
                        id="authorName"
                        {...register('authorName')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]"
                      />
                      {errors.authorName && <p className="text-red-500 text-xs mt-1">{errors.authorName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="quote" className="block text-sm font-medium text-gray-700">Quote</label>
                      <Textarea
                        id="quote"
                        {...register('quote')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]"
                        rows={4}
                      />
                      {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                      <Input
                        id="imageUrl"
                        {...register('imageUrl')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]"
                      />
                      {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                      <Input
                        id="rating"
                        type="number"
                        {...register('rating')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]"
                        min="1"
                        max="5"
                      />
                      {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <DialogClose asChild>
                        <Button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-all duration-200">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded transition-all duration-200"
                        disabled={createMutation.isPending || updateMutation.isPending}
                      >
                        {editingTestimonialId ? 'Update Testimonial' : 'Create Testimonial'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#333333] text-[#F5F5F5]">
                  <TableRow>
                    <TableHead className="text-[#F5F5F5]">Author</TableHead>
                    <TableHead className="text-[#F5F5F5]">Quote</TableHead>
                    <TableHead className="text-[#F5F5F5]">Rating</TableHead>
                    <TableHead className="text-[#F5F5F5]">Image</TableHead>
                    <TableHead className="text-[#F5F5F5] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="py-4 px-6 animate-pulse bg-gray-100 rounded"></TableCell>
                        <TableCell className="py-4 px-6 animate-pulse bg-gray-100 rounded"></TableCell>
                        <TableCell className="py-4 px-6 animate-pulse bg-gray-100 rounded"></TableCell>
                        <TableCell className="py-4 px-6 animate-pulse bg-gray-100 rounded"></TableCell>
                        <TableCell className="py-4 px-6 animate-pulse bg-gray-100 rounded"></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        Error loading testimonials.
                      </TableCell>
                    </TableRow>
                  ) : (testimonials?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No testimonials found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    testimonials?.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell className="font-medium">{testimonial.authorName}</TableCell>
                        <TableCell>{testimonial.quote.substring(0, 100)}{testimonial.quote.length > 100 ? '...' : ''}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {testimonial.imageUrl ? (
                            <img src={testimonial.imageUrl} alt={testimonial.authorName} className="w-12 h-12 object-cover rounded-full" />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 mr-2 transition-all duration-200"
                            onClick={() => handleEditTestimonial(testimonial)}
                          >
                            <FaEdit className="mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 transition-all duration-200"
                            onClick={() => testimonial.id && handleDeleteTestimonial(testimonial.id)}
                          >
                            <FaTrashAlt className="mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminTestimonialsPage;