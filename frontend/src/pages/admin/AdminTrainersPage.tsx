import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import type { TrainerDto } from '@/types/trainer';
import { trainerService } from '@/services/trainerService';

// Zod schema for trainer form
const trainerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  bio: z.string().min(1, 'Bio is required'),
  photoUrl: z.string().url('Must be a valid URL').min(1, 'Photo URL is required'),
});

type TrainerFormValues = z.infer<typeof trainerFormSchema>;

const AdminTrainersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerDto | null>(null);

  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      bio: '',
      photoUrl: '',
    },
  });

  // Fetch all trainers
  const { data: trainers, isLoading, isError } = useQuery<TrainerDto[]>({
    queryKey: ['trainers'],
    queryFn: trainerService.getAllTrainers,
  });

  // Create trainer mutation
  const createTrainerMutation = useMutation({
    mutationFn: (newTrainer: TrainerFormValues) => trainerService.createTrainer(newTrainer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  // Update trainer mutation
  const updateTrainerMutation = useMutation({
    mutationFn: ({ id, updatedTrainer }: { id: string; updatedTrainer: TrainerFormValues }) =>
      trainerService.updateTrainer(id, updatedTrainer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsDialogOpen(false);
      form.reset();
      setEditingTrainer(null);
    },
  });

  // Delete trainer mutation
  const deleteTrainerMutation = useMutation({
    mutationFn: (id: string) => trainerService.deleteTrainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });

  const onSubmit = (values: TrainerFormValues) => {
    if (editingTrainer) {
      updateTrainerMutation.mutate({ id: editingTrainer.id, updatedTrainer: values });
    } else {
      createTrainerMutation.mutate(values);
    }
  };

  const handleCreateNew = () => {
    setEditingTrainer(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEdit = (trainer: TrainerDto) => {
    setEditingTrainer(trainer);
    form.reset({
      name: trainer.name,
      specialization: trainer.specialization,
      bio: trainer.bio,
      photoUrl: trainer.photoUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTrainerMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Manage Trainers</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreateNew}
                  className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Trainer
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-[#1A1A1A]">
                    {editingTrainer ? 'Edit Trainer' : 'Create New Trainer'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingTrainer
                      ? 'Update the details of the trainer.'
                      : 'Fill in the details to add a new trainer.'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Trainer's Name"
                              {...field}
                              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Yoga, Strength Training"
                              {...field}
                              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Short biography"
                              {...field}
                              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="photoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/trainer.jpg"
                              {...field}
                              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createTrainerMutation.isPending || updateTrainerMutation.isPending}
                        className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      >
                        {(createTrainerMutation.isPending || updateTrainerMutation.isPending) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {editingTrainer ? 'Update Trainer' : 'Create Trainer'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white rounded-lg shadow-sm p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-[#DFFF00]" />
                <p className="ml-2 text-gray-600">Loading trainers...</p>
              </div>
            ) : isError ? (
              <div className="text-center text-red-600">
                Failed to load trainers. Please try again.
              </div>
            ) : !trainers || trainers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No trainers found.</p>
                <p className="text-gray-500">Click "Add New Trainer" to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Bio</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainers.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell className="font-medium">{trainer.name}</TableCell>
                        <TableCell>{trainer.specialization}</TableCell>
                        <TableCell>{trainer.bio}</TableCell>
                        <TableCell>
                          {trainer.photoUrl ? (
                            <img
                              src={trainer.photoUrl}
                              alt={trainer.name}
                              className="h-12 w-12 object-cover rounded-full"
                            />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(trainer)}
                            className="hover:bg-gray-200 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-[#1A1A1A]">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  This action cannot be undone. This will permanently delete the{' '}
                                  <span className="font-semibold">{trainer.name}</span> trainer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex justify-end space-x-2 mt-4">
                                <AlertDialogCancel
                                  className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(trainer.id)}
                                  disabled={deleteTrainerMutation.isPending}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                >
                                  {deleteTrainerMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminTrainersPage;