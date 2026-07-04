import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '@/hooks/useTestimonials';
import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// UI Components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

// Radix UI components for dialogs and selects
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';

// Minimal placeholder types to allow compilation as per instruction
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

const AdminTestimonialsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialDto | null>(null);

  const { data: testimonials, isLoading, isError, refetch }: UseQueryResult<TestimonialDto[]> = useAdminTestimonials();
  const createMutation: UseMutationResult<TestimonialDto, Error, CreateTestimonialRequest> = useCreateTestimonial();
  const updateMutation: UseMutationResult<TestimonialDto, Error, UpdateTestimonialRequest> = useUpdateTestimonial();
  const deleteMutation: UseMutationResult<void, Error, string> = useDeleteTestimonial();

  const handleCreateTestimonial = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const newTestimonial: CreateTestimonialRequest = {
      author: formData.get('author') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED',
    };
    await createMutation.mutateAsync(newTestimonial);
    setIsAddModalOpen(false);
    refetch();
  };

  const handleUpdateTestimonial = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTestimonial) return;
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const updatedTestimonial: UpdateTestimonialRequest = {
      id: selectedTestimonial.id,
      author: formData.get('author') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED',
    };
    await updateMutation.mutateAsync(updatedTestimonial);
    setIsEditModalOpen(false);
    setSelectedTestimonial(null);
    refetch();
  };

  const handleDeleteTestimonial = async () => {
    if (!selectedTestimonial) return;
    await deleteMutation.mutateAsync(selectedTestimonial.id);
    setIsDeleteAlertOpen(false);
    setSelectedTestimonial(null);
    refetch();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Testimonials</h1>
        <div className="text-gray-700">Loading testimonials...</div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Testimonials</h1>
        <div className="text-red-600">Error loading testimonials.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Testimonials</h1>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 mb-6">
            Add New Testimonial
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
          <DialogTitle className="text-2xl font-semibold text-[#1A1A1A] mb-4">Add New Testimonial</DialogTitle>
          <form onSubmit={handleCreateTestimonial} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input id="author" name="author" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <Textarea id="content" name="content" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue="PENDING">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 mt-4">
              {createMutation.isPending ? 'Adding...' : 'Add Testimonial'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {testimonials && testimonials.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">{testimonial.author}</TableCell>
                  <TableCell>{testimonial.content.substring(0, 70)}{testimonial.content.length > 70 ? '...' : ''}</TableCell>
                  <TableCell>{testimonial.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 hover:bg-gray-100 transition-all duration-200"
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-700 transition-all duration-200"
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setIsDeleteAlertOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">
          <p className="mb-4">No testimonials found. Add your first testimonial!</p>
        </Card>
      )}

      {/* Edit Testimonial Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
          <DialogTitle className="text-2xl font-semibold text-[#1A1A1A] mb-4">Edit Testimonial</DialogTitle>
          {selectedTestimonial && (
            <form onSubmit={handleUpdateTestimonial} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Author
                </Label>
                <Input id="author" name="author" defaultValue={selectedTestimonial.author} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea id="content" name="content" defaultValue={selectedTestimonial.content} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={selectedTestimonial.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 mt-4">
                {updateMutation.isPending ? 'Updating...' : 'Update Testimonial'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
          <AlertDialogTitle className="text-2xl font-semibold text-[#1A1A1A] mb-4">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 leading-relaxed">
            This action cannot be undone. This will permanently delete the testimonial by &quot;{selectedTestimonial?.author}&quot;.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2 mt-6">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="transition-all duration-200">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteTestimonial}
                className="hover:bg-red-700 transition-all duration-200"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminTestimonialsPage;