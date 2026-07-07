import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea exists in ui components

// Assuming these types and services exist as per the prompt's ground truth rule
// and are derived from the backend contract.
interface Testimonial {
  id: string; // UUID
  author: string;
  text: string;
  rating: number; // Integer
}

// Placeholder for actual service calls
// In a real scenario, these would be imported from frontend/src/services/testimonialService.ts
const testimonialService = {
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    // Simulate API call
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { id: '1', author: 'John Doe', text: 'Amazing gym, great trainers!', rating: 5 },
            { id: '2', author: 'Jane Smith', text: 'Love the classes, very motivating.', rating: 4 },
          ]),
        500
      )
    );
  },
  createTestimonial: async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    console.log('Creating testimonial:', testimonial);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...testimonial, id: crypto.randomUUID() }), 500)
    );
  },
  updateTestimonial: async (id: string, testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    console.log('Updating testimonial:', id, testimonial);
    return new Promise((resolve) => setTimeout(() => resolve({ ...testimonial, id }), 500));
  },
  deleteTestimonial: async (id: string): Promise<void> => {
    console.log('Deleting testimonial:', id);
    return new Promise((resolve) => setTimeout(() => resolve(), 500));
  },
};

const testimonialSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  text: z.string().min(1, 'Testimonial text is required'),
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const AdminTestimonialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDeleteId, setTestimonialToDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author: '',
      text: '',
      rating: 1,
    },
  });

  const {
    data: testimonials,
    isLoading,
    isError,
  } = useQuery<Testimonial[], Error>({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getAllTestimonials,
  });

  const createMutation = useMutation<Testimonial, Error, Omit<Testimonial, 'id'>>({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation<Testimonial, Error, { id: string; data: Omit<Testimonial, 'id'> }>({
    mutationFn: ({ id, data }) => testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsDialogOpen(false);
      reset();
      setEditingTestimonial(null);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setTestimonialToDeleteId(null);
    },
  });

  const onSubmit = (data: TestimonialFormValues) => {
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    reset(testimonial);
    setIsDialogOpen(true);
  };

  const handleDeleteTrigger = (id: string) => {
    setTestimonialToDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (testimonialToDeleteId) {
      deleteMutation.mutate(testimonialToDeleteId);
    }
  };

  const handleOpenDialog = () => {
    setEditingTestimonial(null);
    reset({ author: '', text: '', rating: 1 });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6">Manage Testimonials</h2>

          <Card className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Testimonial List</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleOpenDialog}
                    className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  >
                    Add New Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                  <DialogHeader>
                    <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        {...register('author')}
                        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                      {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="text">Testimonial Text</Label>
                      <Textarea
                        id="text"
                        {...register('text')}
                        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent min-h-[100px]"
                      />
                      {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        {...register('rating')}
                        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                      {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading testimonials...</div>
            ) : isError ? (
              <div className="text-center py-8 text-red-600">Error loading testimonials.</div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Text</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell className="font-medium">{testimonial.id.substring(0, 8)}...</TableCell>
                        <TableCell>{testimonial.author}</TableCell>
                        <TableCell className="max-w-xs truncate">{testimonial.text}</TableCell>
                        <TableCell>{testimonial.rating}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            onClick={() => handleEdit(testimonial)}
                            className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <AlertDialog open={testimonialToDeleteId === testimonial.id} onOpenChange={(open) => !open && setTestimonialToDeleteId(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                onClick={() => handleDeleteTrigger(testimonial.id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the testimonial by{' '}
                                  <strong>{testimonial.author}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleConfirmDelete}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                  disabled={deleteMutation.isPending}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No testimonials found. Add one to get started!</div>
            )}
          </Card>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminTestimonialsPage;