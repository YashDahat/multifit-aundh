import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

// Assuming these types and services are pre-generated and available
import type { GymClassDto, CreateGymClassRequest, UpdateGymClassRequest } from '@/types/gymClass';
import type { TrainerDto } from '@/types/trainer';
import { gymClassService } from '@/services/gymClassService';
import { trainerService } from '@/services/trainerService';

// Zod schema for creating/updating a gym class
const gymClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  trainerId: z.string().uuid('Invalid trainer ID'),
});

type GymClassFormValues = z.infer<typeof gymClassSchema>;

const AdminSchedulePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClassDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDeleteId, setClassToDeleteId] = useState<string | null>(null);

  const {
    data: classes,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
  } = useQuery<GymClassDto[]>({
    queryKey: ['adminClasses'],
    queryFn: gymClassService.getGymClasses,
  });

  const {
    data: trainers,
    isLoading: isLoadingTrainers,
    isError: isErrorTrainers,
  } = useQuery<TrainerDto[]>({
    queryKey: ['adminTrainers'],
    queryFn: trainerService.getTrainers,
  });

  const createClassMutation = useMutation({
    mutationFn: (newClass: CreateGymClassRequest) => gymClassService.createGymClass(newClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClasses'] });
      setIsCreateDialogOpen(false);
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ classId, updatedClass }: { classId: string; updatedClass: UpdateGymClassRequest }) =>
      gymClassService.updateGymClass(classId, updatedClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClasses'] });
      setIsUpdateDialogOpen(false);
      setSelectedClass(null);
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: (classId: string) => gymClassService.deleteGymClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClasses'] });
      setIsDeleteDialogOpen(false);
      setClassToDeleteId(null);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GymClassFormValues>({
    resolver: zodResolver(gymClassSchema),
  });

  const handleCreateClass = (data: GymClassFormValues) => {
    createClassMutation.mutate(data);
  };

  const handleUpdateClass = (data: GymClassFormValues) => {
    if (selectedClass) {
      updateClassMutation.mutate({ classId: selectedClass.id, updatedClass: data });
    }
  };

  const openUpdateDialog = (gymClass: GymClassDto) => {
    setSelectedClass(gymClass);
    setValue('name', gymClass.name);
    setValue('description', gymClass.description);
    setValue('date', gymClass.date);
    setValue('startTime', gymClass.startTime);
    setValue('endTime', gymClass.endTime);
    setValue('capacity', gymClass.capacity);
    setValue('trainerId', gymClass.trainerId);
    setIsUpdateDialogOpen(true);
  };

  const openDeleteDialog = (classId: string) => {
    setClassToDeleteId(classId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (classToDeleteId) {
      deleteClassMutation.mutate(classToDeleteId);
    }
  };

  if (isLoadingClasses || isLoadingTrainers) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">Manage Gym Schedule</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p>Loading gym classes and trainers...</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (isErrorClasses || isErrorTrainers) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">Manage Gym Schedule</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-600">
              <p>Error loading data. Please try again later.</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">Manage Gym Schedule</h2>

          <div className="flex justify-end mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  onClick={() => {
                    reset();
                    setIsCreateDialogOpen(true);
                  }}
                >
                  Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-[#1A1A1A]">Create New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateClass)} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Class Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</Label>
                    <Input
                      id="description"
                      {...register('description')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register('startTime')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...register('endTime')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...register('capacity')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="trainerId" className="block text-sm font-medium text-gray-700">Trainer</Label>
                    <Select onValueChange={(value) => setValue('trainerId', value)} defaultValue="">
                      <SelectTrigger className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                      <SelectContent className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                        {trainers?.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            {trainer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.trainerId && <p className="text-red-500 text-sm mt-1">{errors.trainerId.message}</p>}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createClassMutation.isPending}
                      className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                    >
                      {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {classes && classes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-600">No gym classes found. Add a new class to get started!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Class Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes?.map((gymClass) => (
                    <TableRow key={gymClass.id}>
                      <TableCell className="font-medium">{gymClass.name}</TableCell>
                      <TableCell>{gymClass.description}</TableCell>
                      <TableCell>{gymClass.date}</TableCell>
                      <TableCell>{gymClass.startTime} - {gymClass.endTime}</TableCell>
                      <TableCell>{gymClass.capacity}</TableCell>
                      <TableCell>{gymClass.currentBookings}</TableCell>
                      <TableCell>{gymClass.trainerName}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          onClick={() => openUpdateDialog(gymClass)}
                          className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(gymClass.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
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

          {/* Update Class Dialog */}
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-[#1A1A1A]">Edit Class</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleUpdateClass)} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Class Name</Label>
                  <Input
                    id="edit-name"
                    {...register('name')}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</Label>
                  <Input
                    id="edit-description"
                    {...register('description')}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    {...register('date')}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700">Start Time</Label>
                    <Input
                      id="edit-startTime"
                      type="time"
                      {...register('startTime')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700">End Time</Label>
                    <Input
                      id="edit-endTime"
                      type="time"
                      {...register('endTime')}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-capacity" className="block text-sm font-medium text-gray-700">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    {...register('capacity')}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                  />
                  {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-trainerId" className="block text-sm font-medium text-gray-700">Trainer</Label>
                  <Select onValueChange={(value) => setValue('trainerId', value)} value={selectedClass?.trainerId || ''}>
                    <SelectTrigger className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                      {trainers?.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.trainerId && <p className="text-red-500 text-sm mt-1">{errors.trainerId.message}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    onClick={() => setIsUpdateDialogOpen(false)}
                    className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateClassMutation.isPending}
                    className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  >
                    {updateClassMutation.isPending ? 'Updating...' : 'Update Class'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Class Alert Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-semibold text-[#1A1A1A]">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-700">
                  This action cannot be undone. This will permanently delete the gym class.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  disabled={deleteClassMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                >
                  {deleteClassMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminSchedulePage;