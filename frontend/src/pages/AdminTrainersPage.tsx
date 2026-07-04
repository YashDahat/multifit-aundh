import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminTrainers } from '@/hooks/useAdminTrainers';
import { Trainer } from '@/types/trainer';
import {
  Button,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Label,
} from '@/components/ui/index'; // Assuming index exports all these
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';

const trainerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

type TrainerFormValues = z.infer<typeof trainerSchema>;

const AdminTrainersPage: React.FC = () => {
  const { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } = useAdminTrainers();

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      form.reset();
    }
  }, [editingTrainer, form]);

  const openCreateModal = () => {
    setEditingTrainer(null);
    setIsCreateEditModalOpen(true);
  };

  const openEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsCreateEditModalOpen(true);
  };

  const closeCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditingTrainer(null);
    form.reset();
  };

  const onSubmit = (data: TrainerFormValues) => {
    if (editingTrainer) {
      updateTrainer.mutate(
        { id: editingTrainer.id, trainer: data },
        {
          onSuccess: () => {
            closeCreateEditModal();
          },
        }
      );
    } else {
      createTrainer.mutate(data, {
        onSuccess: () => {
          closeCreateEditModal();
        },
      });
    }
  };

  const openDeleteModal = (id: string) => {
    setDeletingTrainerId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingTrainerId(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingTrainerId) {
      deleteTrainer.mutate(deletingTrainerId, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  };

  const trainers = getAllTrainers.data || [];
  const isLoading = getAllTrainers.isLoading || createTrainer.isPending || updateTrainer.isPending || deleteTrainer.isPending;
  const isError = getAllTrainers.isError || createTrainer.isError || updateTrainer.isError || deleteTrainer.isError;

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Trainer Profiles</h1>
            <Button
              onClick={openCreateModal}
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-6 py-3 transition-all duration-200"
            >
              Create New Trainer
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading trainers...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg">Error loading trainers. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && trainers.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <p className="text-lg text-gray-600">No trainers found. Click "Create New Trainer" to add one.</p>
            </div>
          )}

          {!isLoading && !isError && trainers.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>{trainer.firstName}</TableCell>
                      <TableCell>{trainer.lastName}</TableCell>
                      <TableCell>{trainer.specialization}</TableCell>
                      <TableCell className="max-w-xs truncate">{trainer.bio}</TableCell>
                      <TableCell>
                        {trainer.imageUrl && (
                          <img src={trainer.imageUrl} alt={trainer.firstName} className="w-12 h-12 object-cover rounded-full" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(trainer)}
                          className="mr-2 hover:bg-gray-100 transition-all duration-200"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(trainer.id)}
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
      <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTrainer ? 'Edit Trainer' : 'Create New Trainer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                className={clsx('col-span-3', form.formState.errors.firstName && 'border-red-500')}
              />
              {form.formState.errors.firstName && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                className={clsx('col-span-3', form.formState.errors.lastName && 'border-red-500')}
              />
              {form.formState.errors.lastName && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Input
                id="specialization"
                {...form.register('specialization')}
                className={clsx('col-span-3', form.formState.errors.specialization && 'border-red-500')}
              />
              {form.formState.errors.specialization && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.specialization.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                {...form.register('bio')}
                className={clsx('col-span-3', form.formState.errors.bio && 'border-red-500')}
              />
              {form.formState.errors.bio && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.bio.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                {...form.register('imageUrl')}
                className={clsx('col-span-3', form.formState.errors.imageUrl && 'border-red-500')}
              />
              {form.formState.errors.imageUrl && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateEditModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : editingTrainer ? 'Save Changes' : 'Create Trainer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trainer profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminTrainersPage;