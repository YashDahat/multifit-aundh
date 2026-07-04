import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { useCreateTrialLead } from '../hooks/useTrialLeads';
import { CreateTrialLeadRequest } from '../types/trial';
import clsx from 'clsx';

const trialLeadSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number.').min(1, 'Phone number is required.'),
});

const TrialForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTrialLeadRequest>({
    resolver: zodResolver(trialLeadSchema),
  });

  const { mutate, isLoading, isSuccess, isError, error } = useCreateTrialLead();

  useEffect(() => {
    if (isSuccess) {
      alert("Thank you for your interest! We'll be in touch shortly to set up your trial.");
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (isError) {
      alert(`Failed to submit trial request. Please try again. Error: ${error?.message}`);
    }
  }, [isError, error]);

  const onSubmit = (data: CreateTrialLeadRequest) => {
    mutate(data);
  };

  return (
    <div className="bg-[#333333] rounded-xl shadow-md p-6 text-[#F5F5F5]">
      <h2 className="text-2xl font-bold text-[#DFFF00] mb-4">Claim Your 3-Day Free Trial!</h2>
      <p className="text-[#F5F5F5] mb-6">
        Experience MultiFit Aundh – the antidote to boring gyms. No commitments, just pure fitness.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={clsx(
              "bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full",
              errors.name && "border-red-500"
            )}
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={clsx(
              "bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full",
              errors.email && "border-red-500"
            )}
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={clsx(
              "bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full",
              errors.phone && "border-red-500"
            )}
            disabled={isLoading}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Start Your Free Trial'}
        </button>
      </form>
    </div>
  );
};

export default TrialForm;