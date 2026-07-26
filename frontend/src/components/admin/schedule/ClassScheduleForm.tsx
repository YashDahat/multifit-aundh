import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClassScheduleDto } from '@/types/schedule';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClassSchedule, updateClassSchedule } from '@/services/apiService';
import { toast } from 'sonner';
import { useAllGymClasses } from '@/hooks/useContent'; // Assuming this hook exists for gym classes

const formSchema = z.object({
  gymClassId: z.string().min(1, 'Gym Class is required'),
  scheduleDate: z.string().min(1, 'Schedule Date is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  maxCapacity: z.coerce.number().min(1, 'Max Capacity must be at least 1'),
});

interface ClassScheduleFormProps {
  initialData?: ClassScheduleDto;
  onSuccess?: () => void;
}

export function ClassScheduleForm({ initialData, onSuccess }: ClassScheduleFormProps) {
  const queryClient = useQueryClient();
  const { data: gymClasses, isLoading: isLoadingGymClasses } = useAllGymClasses(); // Fetch available gym classes

  const createMutation = useMutation({
    mutationFn: createClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSchedules'] });
      toast.success('Class schedule created successfully!');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to create class schedule: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassScheduleDto }) =>
      updateClassSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSchedules'] });
      toast.success('Class schedule updated successfully!');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update class schedule: ${error.message}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymClassId: initialData?.gymClassId ?? '',
      scheduleDate: initialData?.scheduleDate ?? '',
      startTime: initialData?.startTime ?? '',
      endTime: initialData?.endTime ?? '',
      maxCapacity: initialData?.maxCapacity ?? 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const scheduleData: ClassScheduleDto = {
      ...initialData, // Preserve existing fields like id, gymClassName, trainerName, currentBookings
      gymClassId: values.gymClassId,
      scheduleDate: values.scheduleDate,
      startTime: values.startTime,
      endTime: values.endTime,
      maxCapacity: values.maxCapacity,
    };

    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: scheduleData });
    } else {
      createMutation.mutate(scheduleData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gymClassId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gym class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingGymClasses ? (
                    <SelectItem value="loading" disabled>
                      Loading classes...
                    </SelectItem>
                  ) : (
                    gymClasses?.map((gymClass) => (
                      <SelectItem key={gymClass.id} value={gymClass.id ?? ''}>
                        {gymClass.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheduleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Capacity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {initialData ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </form>
    </Form>
  );
}