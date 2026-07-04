import React, { useState } from 'react';

export default function TrialForm(): React.ReactElement {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-semibold text-[#1A1A1A]">
          Thank you, {form.name}! We will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col gap-4"
    >
      <div>
        <label htmlFor="trial-name" className="block text-sm font-semibold text-[#1A1A1A] mb-1">
          Name
        </label>
        <input
          id="trial-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label htmlFor="trial-email" className="block text-sm font-semibold text-[#1A1A1A] mb-1">
          Email
        </label>
        <input
          id="trial-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="trial-phone" className="block text-sm font-semibold text-[#1A1A1A] mb-1">
          Phone
        </label>
        <input
          id="trial-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>
      <button
        type="submit"
        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 mt-2"
      >
        Claim My Free Trial
      </button>
    </form>
  );
}
