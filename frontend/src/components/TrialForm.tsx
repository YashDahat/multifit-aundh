import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';

import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useSubmitTrialLead } from '@/hooks/useLeads';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits'),
});

type FormData = z.infer<typeof formSchema>;

const TrialForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending, isSuccess, isError, error } = useSubmitTrialLead();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate({ name: data.name, email: data.email, phone: data.phoneNumber });
  };

  React.useEffect(() => {
    if (isSuccess) {
      reset(); // Reset form on successful submission
    }
  }, [isSuccess, reset]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#F5F5F5] mb-8 text-center">
            Claim Your 3-Day Free Trial!
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[#F5F5F5] mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                className={clsx(
                  'bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full',
                  errors.name && 'border-red-500'
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-[#F5F5F5] mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={clsx(
                  'bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full',
                  errors.email && 'border-red-500'
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-[#F5F5F5] mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                className={clsx(
                  'bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full',
                  errors.phoneNumber && 'border-red-500'
                )}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 w-full mt-6"
            >
              {isPending ? 'Submitting...' : 'Start Your Fitness Journey!'}
            </Button>

            {isSuccess && (
              <p className="text-green-500 text-sm mt-4 text-center">
                Trial request submitted successfully! We'll be in touch shortly.
              </p>
            )}

            {isError && (
              <p className="text-red-500 text-sm mt-4 text-center">
                Failed to submit trial request. Please try again.
                {error?.message && ` Error: ${error.message}`}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrialForm;