import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { MembershipPlanDto } from '@/types/membership';
import { useCreateMembershipPlan, useUpdateMembershipPlan } from '@/hooks/useMemberships';

const formSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  durationInMonths: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  isActive: z.boolean(),
});

type MembershipPlanFormValues = z.infer<typeof formSchema>;

interface MembershipPlanFormProps {
  initialData?: MembershipPlanDto;
  onSuccess?: () => void;
}

export function MembershipPlanForm({ initialData, onSuccess }: MembershipPlanFormProps) {
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();

  const form = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id ?? undefined,
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      durationInMonths: initialData?.durationInMonths ?? 1,
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id ?? undefined,
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        price: initialData.price ?? 0,
        durationInMonths: initialData.durationInMonths ?? 1,
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: MembershipPlanFormValues) => {
    const planDto: MembershipPlanDto = {
      id: values.id ?? null,
      name: values.name,
      description: values.description,
      price: values.price,
      durationInMonths: values.durationInMonths,
      isActive: values.isActive,
    };

    if (initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, plan: planDto });
    } else {
      await createMutation.mutateAsync(planDto);
    }
    onSuccess?.();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationInMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Months)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
        </Button>
      </form>
    </Form>
  );
}