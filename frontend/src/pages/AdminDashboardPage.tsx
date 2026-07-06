import type { JSX } from 'react';
import React from 'react';

export default function AdminDashboardPage(): JSX.Element {
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#F5F5F5] font-bold text-3xl mb-8">Admin Dashboard</h1>
    
        <section className="mb-8">
          <h2 className="text-[#F5F5F5] text-2xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Total Members */}
            <div className="bg-[#1A1A1A] rounded-lg shadow-md p-6 text-[#F5F5F5]">
              <h3 className="text-xl font-semibold mb-2">Total Members: 1500+</h3>
              <p className="text-sm leading-relaxed">Keep the energy high!</p>
            </div>
    
            {/* Card 2: Upcoming Classes */}
            <div className="bg-[#1A1A1A] rounded-lg shadow-md p-6 text-[#F5F5F5]">
              <h3 className="text-xl font-semibold mb-2">Upcoming Classes: 25</h3>
              <p className="text-sm leading-relaxed">Stay on top of the schedule.</p>
            </div>
    
            {/* Card 3: New Trial Leads */}
            <div className="bg-[#1A1A1A] rounded-lg shadow-md p-6 text-[#F5F5F5]">
              <h3 className="text-xl font-semibold mb-2">New Trial Leads: 10</h3>
              <p className="text-sm leading-relaxed">Convert potential into power!</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
