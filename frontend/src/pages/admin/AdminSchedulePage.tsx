import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import clsx from 'clsx';

import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

import * as scheduleService from '@/services/scheduleService';
import * as gymClassService from '@/services/gymClassService';
import * as trainerService from '@/services/trainerService';
import { ClassScheduleDto } from '@/types/schedule';
import { GymClassDto } from '@/types/gymClass';
import { TrainerDto } from '@/types/trainer';

const scheduleSchema = z.object({
  id: z.string().optional(), // For updates
  gymClassId: z.string().min(1, "Gym Class is required."),
  trainerId: z.string().min(1, "Trainer is required."),
  scheduleDate: z.string().min(1, "Schedule Date is required."),
  startTime: z.string().min(1, "Start Time is required."),
  endTime: z.string().min(1, "End Time is required."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const AdminSchedulePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const { data: schedules, isLoading: isLoadingSchedules, isError: isErrorSchedules } = useQuery<ClassScheduleDto[]>({
    queryKey: ['adminSchedules'],
    queryFn: scheduleService.getAllClassSchedules,
  });

  const { data: gymClasses, isLoading: isLoadingGymClasses, isError: isErrorGymClasses } = useQuery<GymClassDto[]>({
    queryKey: ['gymClasses'],
    queryFn: gymClassService.getAllGymClasses,
  });

  const { data: trainers, isLoading: isLoadingTrainers, isError: isErrorTrainers } = useQuery<TrainerDto[]>({
    queryKey: ['trainers'],
    queryFn: trainerService.getAllTrainers,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
  });

  const createScheduleMutation = useMutation({
    mutationFn: scheduleService.createClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchedules'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleFormValues }) =>
      scheduleService.updateClassSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchedules'] });
      setIsModalOpen(false);
      reset();
      setEditingScheduleId(null);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: scheduleService.deleteClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchedules'] });
    },
  });

  const handleAddSchedule = () => {
    setEditingScheduleId(null);
    reset({
      gymClassId: '',
      trainerId: '',
      scheduleDate: '',
      startTime: '',
      endTime: '',
      capacity: 1,
    });
    setIsModalOpen(true);
  };

  const handleEditSchedule = (schedule: ClassScheduleDto) => {
    setEditingScheduleId(schedule.id);
    reset({
      id: schedule.id,
      gymClassId: schedule.gymClassId,
      trainerId: schedule.trainerId,
      scheduleDate: format(new Date(schedule.scheduleDate), 'yyyy-MM-dd'),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      capacity: schedule.capacity,
    });
    setIsModalOpen(true);
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteScheduleMutation.mutate(id);
    }
  };

  const onSubmit = (data: ScheduleFormValues) => {
    if (editingScheduleId) {
      updateScheduleMutation.mutate({ id: editingScheduleId, data });
    } else {
      createScheduleMutation.mutate(data);
    }
  };

  const getGymClassName = useMemo(() => {
    return (id: string) => gymClasses?.find(gc => gc.id === id)?.name || 'N/A';
  }, [gymClasses]);

  const getTrainerName = useMemo(() => {
    return (id: string) => trainers?.find(t => t.id === id)?.name || 'N/A';
  }, [trainers]);

  const isLoading = isLoadingSchedules || isLoadingGymClasses || isLoadingTrainers;
  const isError = isErrorSchedules || isErrorGymClasses || isErrorTrainers;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#1A1A1A]">Manage Class Schedules</h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleAddSchedule}
                    className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded transition-all duration-200"
                  >
                    Add New Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingScheduleId ? 'Edit Class Schedule' : 'Add New Class Schedule'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gymClassId" className="text-right">
                        Gym Class
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('gymClassId', value)}
                        value={register('gymClassId').value}
                      >
                        <SelectTrigger className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.gymClassId && "border-red-500")}>
                          <SelectValue placeholder="Select a gym class" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          {gymClasses?.map((gc) => (
                            <SelectItem key={gc.id} value={gc.id}>
                              {gc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gymClassId && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.gymClassId.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="trainerId" className="text-right">
                        Trainer
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('trainerId', value)}
                        value={register('trainerId').value}
                      >
                        <SelectTrigger className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.trainerId && "border-red-500")}>
                          <SelectValue placeholder="Select a trainer" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          {trainers?.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.trainerId && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.trainerId.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="scheduleDate" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.scheduleDate && "border-red-500")}
                        {...register('scheduleDate')}
                      />
                      {errors.scheduleDate && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.scheduleDate.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startTime" className="text-right">
                        Start Time
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.startTime && "border-red-500")}
                        {...register('startTime')}
                      />
                      {errors.startTime && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.startTime.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endTime" className="text-right">
                        End Time
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.endTime && "border-red-500")}
                        {...register('endTime')}
                      />
                      {errors.endTime && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.endTime.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">
                        Capacity
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        className={clsx("col-span-3 border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]", errors.capacity && "border-red-500")}
                        {...register('capacity')}
                      />
                      {errors.capacity && (
                        <p className="col-span-4 text-red-500 text-sm">{errors.capacity.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="transition-all duration-200">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded transition-all duration-200"
                        disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
                      >
                        {editingScheduleId ? 'Save Changes' : 'Add Schedule'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading schedules...</div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">Error loading schedules.</div>
            ) : schedules && schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No class schedules found.</div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-md">
                <Table>
                  <TableHeader className="bg-[#333333] text-[#F5F5F5]">
                    <TableRow>
                      <TableHead className="text-[#F5F5F5]">Class Name</TableHead>
                      <TableHead className="text-[#F5F5F5]">Trainer</TableHead>
                      <TableHead className="text-[#F5F5F5]">Date</TableHead>
                      <TableHead className="text-[#F5F5F5]">Start Time</TableHead>
                      <TableHead className="text-[#F5F5F5]">End Time</TableHead>
                      <TableHead className="text-[#F5F5F5]">Capacity</TableHead>
                      <TableHead className="text-[#F5F5F5] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules?.map((schedule) => (
                      <TableRow key={schedule.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <TableCell>{getGymClassName(schedule.gymClassId)}</TableCell>
                        <TableCell>{getTrainerName(schedule.trainerId)}</TableCell>
                        <TableCell>{format(new Date(schedule.scheduleDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{schedule.startTime}</TableCell>
                        <TableCell>{schedule.endTime}</TableCell>
                        <TableCell>{schedule.capacity}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleEditSchedule(schedule)}
                            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-1 px-3 rounded mr-2 transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition-all duration-200"
                            disabled={deleteScheduleMutation.isPending}
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
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminSchedulePage;