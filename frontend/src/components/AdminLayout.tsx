import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col">
        <div className="p-4 text-2xl font-bold text-[#DFFF00]">
          MultiFit Aundh Admin
        </div>
        <nav className="mt-10 space-y-2">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/memberships"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Memberships
          </NavLink>
          <NavLink
            to="/admin/schedule"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Schedule
          </NavLink>
          <NavLink
            to="/admin/trainers"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Trainers
          </NavLink>
          <NavLink
            to="/admin/testimonials"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Testimonials
          </NavLink>
          <NavLink
            to="/admin/leads"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[#333333] text-[#DFFF00]'
                  : 'text-[#F5F5F5] hover:bg-[#333333]'
              }`
            }
          >
            Leads
          </NavLink>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-gray-50">
        {/* Header bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Welcome, Admin!</h1>
          {/* Placeholder for user actions */}
          <div>
            {/* e.g., <button>Logout</button> */}
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;