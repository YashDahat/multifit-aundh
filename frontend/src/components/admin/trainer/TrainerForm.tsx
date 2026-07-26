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
import { Textarea } from '@/components/ui/textarea';
import { TrainerDto } from '@/types/trainer';

const trainerFormSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

type TrainerFormValues = z.infer<typeof trainerFormSchema>;

interface TrainerFormProps {
  initialData?: TrainerDto | null;
  onSubmit: (data: TrainerDto) => void;
  onCancel: () => void;
}

export function TrainerForm({ initialData, onSubmit, onCancel }: TrainerFormProps) {
  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      id: initialData?.id ?? null,
      name: initialData?.name ?? '',
      specialization: initialData?.specialization ?? '',
      bio: initialData?.bio ?? '',
      imageUrl: initialData?.imageUrl ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id ?? null,
        name: initialData.name ?? '',
        specialization: initialData.specialization ?? '',
        bio: initialData.bio ?? '',
        imageUrl: initialData.imageUrl ?? '',
      });
    } else {
      form.reset({
        id: null,
        name: '',
        specialization: '',
        bio: '',
        imageUrl: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: TrainerFormValues) => {
    onSubmit({
      id: data.id ?? null,
      name: data.name,
      specialization: data.specialization,
      bio: data.bio,
      imageUrl: data.imageUrl,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Create Trainer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
