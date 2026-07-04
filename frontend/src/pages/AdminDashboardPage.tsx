import React from 'react';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Total Members</h2>
          <p className="text-4xl font-bold text-[#DFFF00]">1,234</p>
        </div>

        {/* Card 2: Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Upcoming Classes</h2>
          <p className="text-4xl font-bold text-[#DFFF00]">15</p>
        </div>

        {/* Card 3: New Leads This Week */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">New Leads This Week</h2>
          <p className="text-4xl font-bold text-[#DFFF00]">42</p>
        </div>
      </div>

      <p className="text-lg text-gray-600 mt-4">
        Empowering Your Fitness Community at MultiFit Aundh!
      </p>
    </AdminLayout>
  );
};

export default AdminDashboardPage;