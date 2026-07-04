import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Welcome to the MultiFit Aundh Admin Dashboard!
            </h1>
            <p className="text-[#333333] leading-relaxed mt-2">
              Empower your fitness community. Manage trainers, testimonials, and leads with ease.
            </p>

            <div className="mt-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6">
                Summary Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Admin Card for Total Trainers */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Total Trainers</h3>
                  <p className="text-4xl font-bold text-[#DFFF00]">15</p>
                  <p className="text-sm text-gray-500 mt-1">Active trainers in your gym</p>
                </div>

                {/* Admin Card for New Leads This Week */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">New Leads This Week</h3>
                  <p className="text-4xl font-bold text-[#DFFF00]">7</p>
                  <p className="text-sm text-gray-500 mt-1">New inquiries received</p>
                </div>

                {/* Admin Card for Pending Testimonials */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Pending Testimonials</h3>
                  <p className="text-4xl font-bold text-[#DFFF00]">3</p>
                  <p className="text-sm text-gray-500 mt-1">Awaiting your approval</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;