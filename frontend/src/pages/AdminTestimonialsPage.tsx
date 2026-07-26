'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TestimonialDto } from '@/types/content';
import { useContent } from '@/hooks/useContent';
import { TestimonialTable } from '@/components/admin/testimonial/TestimonialTable';
import { TestimonialForm } from '@/components/admin/testimonial/TestimonialForm';
import { DeleteConfirmationDialog } from '@/components/admin/common/DeleteConfirmationDialog';
import { deleteTestimonial } from '@/services/testimonialService';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const { testimonialsQuery } = useContent();
  const { data: testimonials, isLoading, isError } = testimonialsQuery;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDto | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testimonialToDeleteId, setTestimonialToDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully!');
      setIsDeleteDialogOpen(false);
      setTestimonialToDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    },
  });

  const handleEdit = (testimonial: TestimonialDto) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTestimonialToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (testimonialToDeleteId) {
      deleteMutation.mutate(testimonialToDeleteId);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTestimonial(undefined);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Testimonials</h1>
            <div>Loading testimonials...</div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Testimonials</h1>
            <div>Error loading testimonials.</div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Testimonials</h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#DFFF00] hover:bg-[#c7e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  onClick={() => {
                    setEditingTestimonial(undefined);
                    setIsFormOpen(true);
                  }}
                >
                  Add New Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                </DialogHeader>
                <TestimonialForm initialData={editingTestimonial} onSuccess={handleFormSuccess} />
              </DialogContent>
            </Dialog>
          </div>

          {testimonials && testimonials.length > 0 ? (
            <TestimonialTable testimonials={testimonials} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <div className="text-center py-10 text-gray-600">No testimonials found.</div>
          )}

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Confirm Deletion"
            message="Are you sure you want to delete this testimonial? This action cannot be undone."
            onConfirm={confirmDelete}
          />
        </div>
      </section>
    </AdminLayout>
  );
}