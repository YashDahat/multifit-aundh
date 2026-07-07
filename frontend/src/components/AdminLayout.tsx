import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/memberships', label: 'Memberships' },
    { path: '/admin/schedule', label: 'Schedule' },
    { path: '/admin/trainers', label: 'Trainers' },
    { path: '/admin/leads', label: 'Leads' },
    { path: '/admin/testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  "block px-4 py-2 rounded-md transition-all duration-200",
                  isActive ? "bg-[#333333] text-[#DFFF00] font-bold" : "hover:bg-gray-700"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-[#1A1A1A] text-[#F5F5F5] p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-semibold">MultiFit Aundh Admin</h1>
          <button
            onClick={logout}
            className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;