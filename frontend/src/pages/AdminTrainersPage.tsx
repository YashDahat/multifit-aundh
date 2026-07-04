import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdminTrainers } from '@/hooks/useAdminTrainers';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from '@radix-ui/react-alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trainer } from '../types/trainer';
import { clsx } from 'clsx'; // For className merging

// Zod schema for trainer form validation
const trainerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

type TrainerFormValues = z.infer<typeof trainerSchema>;

export const AdminTrainersPage = (): JSX.Element => {
  const { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } = useAdminTrainers();

  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingTrainerId, setDeletingTrainerId] = useState<string | null>(null);

  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      specialization: '',
      bio: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (editingTrainer) {
      form.reset({
        firstName: editingTrainer.firstName,
        lastName: editingTrainer.lastName,
        specialization: editingTrainer.specialization,
        bio: editingTrainer.bio,
        imageUrl: editingTrainer.imageUrl,
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        specialization: '',
        bio: '',
        imageUrl: '',
      });
    }
  }, [editingTrainer, form]);

  const handleCreateTrainerClick = () => {
    setEditingTrainer(null);
    setIsTrainerModalOpen(true);
  };

  const handleEditTrainerClick = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsTrainerModalOpen(true);
  };

  const handleDeleteTrainerClick = (id: string) => {
    setDeletingTrainerId(id);
    setIsDeleteAlertOpen(true);
  };

  const onSubmit = (data: TrainerFormValues) => {
    if (editingTrainer) {
      updateTrainer.mutate(
        { id: editingTrainer.id, trainer: data },
        {
          onSuccess: () => {
            setIsTrainerModalOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createTrainer.mutate(data, {
        onSuccess: () => {
          setIsTrainerModalOpen(false);
          form.reset();
        },
      });
    }
  };

  const confirmDelete = () => {
    if (deletingTrainerId) {
      deleteTrainer.mutate(deletingTrainerId, {
        onSuccess: () => {
          setIsDeleteAlertOpen(false);
          setDeletingTrainerId(null);
        },
      });
    }
  };

  const trainers = useMemo(() => {
    return getAllTrainers.data || [];
  }, [getAllTrainers.data]);

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Trainer Profiles</h1>

          <div className="mb-6 flex justify-end">
            <Button
              onClick={handleCreateTrainerClick}
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-6 py-3 transition-all duration-200"
            >
              Create New Trainer
            </Button>
          </div>

          {getAllTrainers.isLoading && (
            <div className="text-center py-8">
              <p>Loading trainers...</p>
            </div>
          )}

          {getAllTrainers.isError && (
            <div className="text-center py-8 text-red-600">
              <p>Error loading trainers: {getAllTrainers.error?.message}</p>
            </div>
          )}

          {!getAllTrainers.isLoading && !getAllTrainers.isError && trainers.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <p>No trainers found. Create a new trainer to get started!</p>
            </div>
          )}

          {!getAllTrainers.isLoading && !getAllTrainers.isError && trainers.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>
                        <img
                          src={trainer.imageUrl}
                          alt={`${trainer.firstName} ${trainer.lastName}`}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </TableCell>
                      <TableCell>{trainer.firstName}</TableCell>
                      <TableCell>{trainer.lastName}</TableCell>
                      <TableCell>{trainer.specialization}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {trainer.bio.length > 100 ? `${trainer.bio.substring(0, 97)}...` : trainer.bio}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTrainerClick(trainer)}
                          className="mr-2 hover:bg-gray-100 transition-all duration-200"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTrainerClick(trainer.id)}
                          className="hover:bg-red-700 transition-all duration-200"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* Create/Edit Trainer Modal */}
      <Dialog open={isTrainerModalOpen} onOpenChange={setIsTrainerModalOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>{editingTrainer ? 'Edit Trainer' : 'Create New Trainer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register('firstName')} />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register('lastName')} />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...form.register('specialization')} />
              {form.formState.errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.specialization.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register('bio')} />
              {form.formState.errors.bio && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.bio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...form.register('imageUrl')} />
              {form.formState.errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTrainerModalOpen(false)}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTrainer.isPending || updateTrainer.isPending}
                className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold transition-all duration-200"
              >
                {editingTrainer
                  ? updateTrainer.isPending
                    ? 'Saving...'
                    : 'Save Changes'
                  : createTrainer.isPending
                    ? 'Creating...'
                    : 'Create Trainer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trainer profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100 transition-all duration-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteTrainer.isPending}
              className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
            >
              {deleteTrainer.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};