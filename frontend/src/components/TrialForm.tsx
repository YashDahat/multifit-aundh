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
import { useSubmitTrialLead } from '../hooks/useLeads';

// Define the Zod schema for the trial lead form
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

type TrialFormValues = z.infer<typeof formSchema>;

export const TrialForm = () => {
  const { mutate, isPending, isSuccess, isError, error } = useSubmitTrialLead();

  const form = useForm<TrialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = (values: TrialFormValues) => {
    mutate(values);
  };

  // Optional: Provide feedback on submission status
  // The instruction does not explicitly ask for UI feedback like toasts,
  // so we'll keep it minimal.
  if (isSuccess) {
    // console.log('Trial lead submitted successfully!');
    form.reset(); // Clear the form on success
  }
  if (isError) {
    // console.error('Error submitting trial lead:', error.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200"
        >
          {isPending ? 'Submitting...' : 'SUBMIT FOR TRIAL'}
        </Button>
      </form>
    </Form>
  );
};