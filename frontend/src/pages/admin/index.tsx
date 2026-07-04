import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Welcome to the MultiFit Aundh Admin Dashboard!</h1>
          <p className="text-[#333333] leading-relaxed mt-2">
            Empower your fitness community. Manage trainers, testimonials, and leads with ease.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Total Trainers */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Total Trainers</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">15</p> {/* Placeholder value */}
            </div>

            {/* Card 2: New Leads This Week */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">New Leads This Week</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">7</p> {/* Placeholder value */}
            </div>

            {/* Card 3: Pending Testimonials */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Pending Testimonials</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">3</p> {/* Placeholder value */}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}