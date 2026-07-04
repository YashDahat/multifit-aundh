import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#333333] text-[#F5F5F5] flex flex-col p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-[#DFFF00]">MultiFit Aundh Admin</h1>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  clsx(
                    "py-2 px-4 rounded-lg block transition-all duration-200",
                    isActive ? "bg-[#1A1A1A] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-gray-700"
                  )
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/memberships"
                className={({ isActive }) =>
                  clsx(
                    "py-2 px-4 rounded-lg block transition-all duration-200",
                    isActive ? "bg-[#1A1A1A] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-gray-700"
                  )
                }
              >
                Memberships
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/trainers"
                className={({ isActive }) =>
                  clsx(
                    "py-2 px-4 rounded-lg block transition-all duration-200",
                    isActive ? "bg-[#1A1A1A] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-gray-700"
                  )
                }
              >
                Trainers
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/leads"
                className={({ isActive }) =>
                  clsx(
                    "py-2 px-4 rounded-lg block transition-all duration-200",
                    isActive ? "bg-[#1A1A1A] text-[#DFFF00]" : "text-[#F5F5F5] hover:bg-gray-700"
                  )
                }
              >
                Leads
              </NavLink>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded-lg transition-all duration-200 text-[#F5F5F5] hover:bg-red-700 mt-auto"
        >
          Logout
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F5] p-8 text-gray-800 leading-relaxed">
        {children}
      </div>
    </div>
  );
};