import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitTrialLead } from '@/hooks/useMarketingContent';
import { CreateTrialLead } from '@/types/marketing';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Zod schema for CreateTrialLead
const trialLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number. Must be 10-15 digits, optionally with a '+' prefix."),
});

const TrialLeadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTrialLead>({
    resolver: zodResolver(trialLeadSchema),
  });

  const { mutate, isPending, isSuccess, isError } = useSubmitTrialLead();

  const onSubmit = (data: CreateTrialLead) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // Reset form fields on successful submission
      },
    });
  };

  return (
    <div className="bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5]">
      <h2 className="text-3xl font-bold text-[#DFFF00] mb-4">Ignite Your Journey: Claim Your 3-Day Free Trial!</h2>
      <p className="text-lg text-[#F5F5F5] mb-6">
        Experience the MultiFit Aundh difference – no commitment, just pure fitness.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-[#DFFF00] focus:border-[#DFFF00] focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-[#DFFF00] focus:border-[#DFFF00] focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#F5F5F5] mb-1">
            Your Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-[#DFFF00] focus:border-[#DFFF00] focus:outline-none"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : 'Start My Free Trial!'}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-6 flex items-center text-green-500 font-semibold">
          <FaCheckCircle className="mr-2 text-xl" />
          <span>Awesome! Your trial request is in. Get ready to experience the best of MultiFit Aundh!</span>
        </div>
      )}

      {isError && (
        <div className="mt-6 flex items-center text-red-500 font-semibold">
          <FaExclamationCircle className="mr-2 text-xl" />
          <span>Oops! Something went wrong. Please try again or contact us directly.</span>
        </div>
      )}
    </div>
  );
};

export default TrialLeadForm;