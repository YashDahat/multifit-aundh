import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col justify-between p-4 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">MultiFit Aundh Admin</h2>
          <nav className="space-y-2">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                clsx(
                  "py-2 px-4 block rounded-md transition-all duration-200",
                  isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-[#333333]"
                )
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/trainers"
              className={({ isActive }) =>
                clsx(
                  "py-2 px-4 block rounded-md transition-all duration-200",
                  isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-[#333333]"
                )
              }
            >
              Trainers
            </NavLink>
            <NavLink
              to="/admin/testimonials"
              className={({ isActive }) =>
                clsx(
                  "py-2 px-4 block rounded-md transition-all duration-200",
                  isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-[#333333]"
                )
              }
            >
              Testimonials
            </NavLink>
            <NavLink
              to="/admin/leads"
              className={({ isActive }) =>
                clsx(
                  "py-2 px-4 block rounded-md transition-all duration-200",
                  isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-[#333333]"
                )
              }
            >
              Leads
            </NavLink>
          </nav>
        </div>
        <button
          onClick={logout}
          className="mt-8 w-full bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F5] p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;