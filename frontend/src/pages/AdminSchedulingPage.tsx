import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { ClassScheduleDto } from '@/types/schedule';
import { ClassScheduleTable } from '@/components/admin/schedule/ClassScheduleTable';
import { ClassScheduleForm } from '@/components/admin/schedule/ClassScheduleForm';
import { DeleteConfirmationDialog } from '@/components/admin/common/DeleteConfirmationDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteClassSchedule, getAllGymClasses, getScheduleForWeek } from '@/services/apiService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Custom hook to fetch all gym classes
const useAllGymClasses = () => {
  return useQuery({
    queryKey: ['gymClasses'],
    queryFn: getAllGymClasses,
  });
};

// Custom hook to fetch all class schedules
const useAllClassSchedules = () => {
  return useQuery<ClassScheduleDto[]>({
    queryKey: ['classSchedules'],
    queryFn: getScheduleForWeek, // Using getScheduleForWeek for now, assuming it returns all schedules for admin
  });
};

const AdminSchedulingPage = () => {
  const queryClient = useQueryClient();
  const { data: schedules, isLoading: isLoadingSchedules, error: schedulesError } = useAllClassSchedules();
  const { data: gymClasses, isLoading: isLoadingGymClasses, error: gymClassesError } = useAllGymClasses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassScheduleDto | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSchedules'] });
      toast.success('Class schedule deleted successfully!');
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete class schedule: ${error.message}`);
    },
  });

  const handleEdit = (schedule: ClassScheduleDto) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleDelete = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (scheduleToDelete) {
      deleteMutation.mutate(scheduleToDelete);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingSchedule(undefined);
  };

  if (isLoadingSchedules || isLoadingGymClasses) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Class Schedules</h1>
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (schedulesError || gymClassesError) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Class Schedules</h1>
            <p className="text-red-500">Error loading data: {schedulesError?.message || gymClassesError?.message}</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Class Schedules</h1>

          <div className="flex justify-end mb-6">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingSchedule(undefined); setIsFormOpen(true); }}>
                  <PlusCircleIcon className="mr-2 h-5 w-5" /> Add New Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingSchedule ? 'Edit Class Schedule' : 'Create New Class Schedule'}</DialogTitle>
                </DialogHeader>
                <ClassScheduleForm initialData={editingSchedule} onSuccess={handleFormSuccess} />
              </DialogContent>
            </Dialog>
          </div>

          <ClassScheduleTable
            schedules={schedules || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Confirm Deletion"
            message="Are you sure you want to delete this class schedule? This action cannot be undone."
            onConfirm={confirmDelete}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminSchedulingPage;