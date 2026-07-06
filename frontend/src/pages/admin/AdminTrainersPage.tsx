import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/Skeleton';

import * as trainerService from '@/services/trainerService';
import { TrainerDto } from '@/types/trainer';

const trainerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  bio: z.string().min(1, "Bio is required"),
  imageUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

type TrainerFormValues = z.infer<typeof trainerFormSchema>;

const AdminTrainersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trainers, isLoading, isError } = useQuery<TrainerDto[]>({
    queryKey: ['trainers'],
    queryFn: trainerService.getAllTrainers,
  });

  const createTrainerMutation = useMutation({
    mutationFn: trainerService.createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer created successfully.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create trainer: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateTrainerMutation = useMutation({
    mutationFn: (trainer: TrainerDto) => trainerService.updateTrainer(trainer.id, trainer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer updated successfully.",
      });
      setIsModalOpen(false);
      setEditingTrainerId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update trainer: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteTrainerMutation = useMutation({
    mutationFn: trainerService.deleteTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete trainer: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      bio: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isModalOpen && editingTrainerId && trainers) {
      const trainerToEdit = trainers.find(t => t.id === editingTrainerId);
      if (trainerToEdit) {
        form.reset({
          name: trainerToEdit.name,
          specialization: trainerToEdit.specialization,
          bio: trainerToEdit.bio,
          imageUrl: trainerToEdit.imageUrl || '',
        });
      }
    } else if (!isModalOpen) {
      form.reset();
      setEditingTrainerId(null);
    }
  }, [isModalOpen, editingTrainerId, trainers, form]);

  const onSubmit = (values: TrainerFormValues) => {
    const trainerData = {
      ...values,
      imageUrl: values.imageUrl || undefined, // Ensure empty string becomes undefined for optional field
    };

    if (editingTrainerId) {
      updateTrainerMutation.mutate({ ...trainerData, id: editingTrainerId } as TrainerDto);
    } else {
      createTrainerMutation.mutate(trainerData);
    }
  };

  const handleEdit = (trainer: TrainerDto) => {
    setEditingTrainerId(trainer.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTrainerMutation.mutate(id);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#1A1A1A]">Manage Trainers</h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded"
                    onClick={() => {
                      setEditingTrainerId(null);
                      form.reset();
                    }}
                  >
                    Add New Trainer
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingTrainerId ? 'Edit Trainer' : 'Create Trainer'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00] w-full"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Specialization</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00] w-full"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00] w-full"
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Image URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00] w-full"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded"
                          disabled={createTrainerMutation.isPending || updateTrainerMutation.isPending}
                        >
                          {editingTrainerId ? 'Save Changes' : 'Create Trainer'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {isLoading ? (
                <div className="p-6">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : isError ? (
                <div className="p-6 text-center text-red-600">Failed to load trainers.</div>
              ) : trainers && trainers.length > 0 ? (
                <Table>
                  <TableHeader className="bg-[#333333] text-[#F5F5F5]">
                    <TableRow className="border-b border-gray-700">
                      <TableHead className="text-[#F5F5F5]">Name</TableHead>
                      <TableHead className="text-[#F5F5F5]">Specialization</TableHead>
                      <TableHead className="text-[#F5F5F5]">Bio</TableHead>
                      <TableHead className="text-[#F5F5F5]">Image</TableHead>
                      <TableHead className="text-[#F5F5F5] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainers.map((trainer) => (
                      <TableRow key={trainer.id} className="border-b border-gray-200 last:border-b-0">
                        <TableCell className="py-3 px-4">{trainer.name}</TableCell>
                        <TableCell className="py-3 px-4">{trainer.specialization}</TableCell>
                        <TableCell className="py-3 px-4">
                          {trainer.bio.length > 50 ? trainer.bio.substring(0, 50) + '...' : trainer.bio}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {trainer.imageUrl ? (
                            <img src={trainer.imageUrl} alt={trainer.name} className="h-10 w-10 object-cover rounded-full" />
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right space-x-2">
                          <Button
                            onClick={() => handleEdit(trainer)}
                            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-all duration-200"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-700">
                                  This action cannot be undone. This will permanently delete the trainer profile.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    onClick={() => handleDelete(trainer.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-all duration-200"
                                    disabled={deleteTrainerMutation.isPending}
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No trainers found. Click "Add New Trainer" to get started.
                </div>
              )}
            </div>
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminTrainersPage;