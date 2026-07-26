import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { TrainerDto } from '@/types/content';
import { TrainerTable } from '@/components/admin/trainer/TrainerTable';
import { TrainerForm } from '@/components/admin/trainer/TrainerForm';
import { DeleteConfirmationDialog } from '@/components/admin/common/DeleteConfirmationDialog';
import { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } from '@/services/trainerService'; // Corrected import from trainerService

export default function AdminTrainersPage() {
  const queryClient = useQueryClient();
  const { data: trainers, isLoading, error } = useQueryClient().getQueryData(['trainers']) || useQueryClient().fetchQuery({ queryKey: ['trainers'], queryFn: getAllTrainers });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerDto | null>(null);
  const [trainerToDeleteId, setTrainerToDeleteId] = useState<string | null>(null);

  const createTrainerMutation = useMutation({
    mutationFn: createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer created successfully!');
      setIsFormOpen(false);
    },
    onError: (err) => {
      toast.error(`Failed to create trainer: ${err.message}`);
    },
  });

  const updateTrainerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TrainerDto }) => updateTrainer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer updated successfully!');
      setIsFormOpen(false);
      setSelectedTrainer(null);
    },
    onError: (err) => {
      toast.error(`Failed to update trainer: ${err.message}`);
    },
  });

  const deleteTrainerMutation = useMutation({
    mutationFn: deleteTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer deleted successfully!');
      setIsDeleteDialogOpen(false);
      setTrainerToDeleteId(null);
    },
    onError: (err) => {
      toast.error(`Failed to delete trainer: ${err.message}`);
    },
  });

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setIsFormOpen(true);
  };

  const handleEditTrainer = (trainer: TrainerDto) => {
    setSelectedTrainer(trainer);
    setIsFormOpen(true);
  };

  const handleDeleteTrainer = (trainerId: string) => {
    setTrainerToDeleteId(trainerId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (trainerToDeleteId) {
      deleteTrainerMutation.mutate(trainerToDeleteId);
    }
  };

  const handleFormSubmit = (data: TrainerDto) => {
    if (selectedTrainer?.id) {
      updateTrainerMutation.mutate({ id: selectedTrainer.id, data });
    } else {
      createTrainerMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Trainers</h1>
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Trainers</h1>
            <p className="text-red-500">Error loading trainers: {error.message}</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage Trainers</h1>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddTrainer}>Add New Trainer</Button>
          </div>
          <TrainerTable trainers={trainers || []} onEdit={handleEditTrainer} onDelete={handleDeleteTrainer} />

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedTrainer ? 'Edit Trainer' : 'Create New Trainer'}</DialogTitle>
              </DialogHeader>
              <TrainerForm
                initialData={selectedTrainer}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Confirm Deletion"
            message="Are you sure you want to delete this trainer? This action cannot be undone."
            onConfirm={confirmDelete}
          />
        </div>
      </section>
    </AdminLayout>
  );
}