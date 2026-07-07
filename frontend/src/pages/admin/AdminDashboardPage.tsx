import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboardPage: React.FC = () => {
  const adminSections = [
    { title: 'Manage Memberships', description: 'View, create, edit, and delete membership plans.', link: '/admin/memberships' },
    { title: 'Manage Schedule', description: 'Organize gym classes, trainers, and timings.', link: '/admin/schedule' },
    { title: 'Manage Trainers', description: 'Add, update, and remove trainer profiles.', link: '/admin/trainers' },
    { title: 'View Leads', description: 'Review new trial sign-up leads.', link: '/admin/leads' },
    { title: 'Manage Testimonials', description: 'Approve and manage customer testimonials.', link: '/admin/testimonials' },
  ];

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">Admin Dashboard</h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome to the MultiFit Aundh Admin Panel. Use the navigation to manage various aspects of the gym's operations.
          </p>

          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => (
              <Link
                key={section.link}
                to={section.link}
                className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <span className="text-[#DFFF00] hover:text-yellow-500 font-semibold transition-all duration-200">
                  Go to {section.title.split(' ')[1]} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;