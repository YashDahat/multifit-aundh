import React from 'react';
import { AdminLayout } from '../components/AdminLayout';

const AdminDashboardPage = (): JSX.Element => {
  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, MultiFit Aundh Admin!</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Summary Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Members</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">150</p>
            </div>

            {/* Summary Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">New Trial Leads (Last 30 Days)</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">12</p>
            </div>

            {/* Summary Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Active Trainers</h2>
              <p className="text-4xl font-bold text-[#DFFF00]">5</p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;