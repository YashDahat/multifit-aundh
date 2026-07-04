import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1A1A1A]">
              Welcome to the MultiFit Aundh Admin Dashboard!
            </h1>
            <p className="text-[#333333] leading-relaxed mt-2 mb-8">
              Empower your fitness community. Manage trainers, testimonials, and leads with ease.
            </p>

            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6">Summary Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Total Trainers</h3>
                <p className="text-3xl font-bold text-[#DFFF00]">15</p>
                <p className="text-[#333333] mt-2">Currently active trainers in your gym.</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">New Leads This Week</h3>
                <p className="text-3xl font-bold text-[#DFFF00]">7</p>
                <p className="text-[#333333] mt-2">New inquiries received recently.</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Pending Testimonials</h3>
                <p className="text-3xl font-bold text-[#DFFF00]">3</p>
                <p className="text-[#333333] mt-2">Testimonials awaiting your approval.</p>
              </div>
            </div>
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;