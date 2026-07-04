import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAdminTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from '../../hooks/useTrainers';
import { Trainer } from '../../types/trainer';
import {
  Dialog,
  DialogContent,
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
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const AdminTrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error, refetch } = useAdminTrainers();
  const createMutation = useCreateTrainer();
  const updateMutation = useUpdateTrainer();
  const deleteMutation = useDeleteTrainer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [trainerToDeleteId, setTrainerToDeleteId] = useState<string | null>(null);

  const handleCreateTrainer = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newTrainer = {
      name: form.trainerName.value,
      specialization: form.specialization.value,
      description: form.description.value,
    };
    createMutation.mutate(newTrainer, {
      onSuccess: () => {
        refetch();
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        console.error('Failed to create trainer:', err);
      },
    });
  };

  const handleUpdateTrainer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingTrainer) return;

    const form = event.target as HTMLFormElement;
    const updatedTrainer = {
      id: editingTrainer.id,
      name: form.trainerName.value,
      specialization: form.specialization.value,
      description: form.description.value,
    };
    updateMutation.mutate(updatedTrainer, {
      onSuccess: () => {
        refetch();
        setIsEditModalOpen(false);
        setEditingTrainer(null);
      },
      onError: (err) => {
        console.error('Failed to update trainer:', err);
      },
    });
  };

  const handleDeleteTrainer = () => {
    if (trainerToDeleteId) {
      deleteMutation.mutate(trainerToDeleteId, {
        onSuccess: () => {
          refetch();
          setIsDeleteAlertOpen(false);
          setTrainerToDeleteId(null);
        },
        onError: (err) => {
          console.error('Failed to delete trainer:', err);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Trainers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Trainers</h1>
        <p className="text-red-600">Error loading trainers: {error?.message}</p>
      </AdminLayout>
    );
  }

  const hasTrainers = trainers && trainers.length > 0;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Trainers</h1>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <button
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 mb-6"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Trainer
          </button>
        </DialogTrigger>
        <DialogContent className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="mb-4">
              <DialogTitle className="text-2xl font-bold">Add New Trainer</DialogTitle>
            </div>
            <form onSubmit={handleCreateTrainer} className="space-y-4">
              <div>
                <Label htmlFor="trainerName" className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</Label>
                <Input id="trainerName" name="trainerName" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <Label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</Label>
                <Input id="specialization" name="specialization" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
                <Textarea id="description" name="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></Textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="mb-4">
              <DialogTitle className="text-2xl font-bold">Edit Trainer</DialogTitle>
            </div>
            {editingTrainer && (
              <form onSubmit={handleUpdateTrainer} className="space-y-4">
                <div>
                  <Label htmlFor="editTrainerName" className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</Label>
                  <Input id="editTrainerName" name="trainerName" type="text" required defaultValue={editingTrainer.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <Label htmlFor="editSpecialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</Label>
                  <Input id="editSpecialization" name="specialization" type="text" required defaultValue={editingTrainer.specialization} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <Label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
                  <Textarea id="editDescription" name="description" rows={3} defaultValue={editingTrainer.description} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></Textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    type="submit"
                    className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Trainer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold mb-4">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-700 mb-4">
                Are you sure you want to delete this trainer? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-end space-x-2">
              <AlertDialogCancel asChild>
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Cancel
                </button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  onClick={handleDeleteTrainer}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {!hasTrainers ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 text-lg mb-4">No trainers found.</p>
          <p className="text-gray-500">Click "Add New Trainer" to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainers?.map((trainer) => (
                <tr key={trainer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trainer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trainer.specialization}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {trainer.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingTrainer(trainer);
                        setIsEditModalOpen(true);
                      }}
                      className="text-[#DFFF00] hover:text-[#ADCC00] transition-colors duration-200 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setTrainerToDeleteId(trainer.id);
                        setIsDeleteAlertOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTrainersPage;