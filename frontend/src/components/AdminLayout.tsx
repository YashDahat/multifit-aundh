import React, { useEffect, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || !user.roles?.includes('ADMIN')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#333333]">
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[#1A1A1A] text-[#F5F5F5] p-6 flex flex-col">
        <div className="text-2xl font-bold mb-8">
          <span className="text-[#DFFF00]">MultiFit</span>{' '}
          <span className="text-[#F5F5F5]">Admin</span>
        </div>
        <nav className="flex-1">
          <ul>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Users
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/memberships"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Memberships
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Bookings
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/schedule"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Schedule
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/trainers"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Trainers
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/testimonials"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Testimonials
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink
                to="/admin/leads"
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-4 rounded-md transition-all duration-200",
                    "hover:bg-[#333333] hover:text-[#DFFF00]",
                    isActive ? "bg-[#333333] text-[#DFFF00]" : "text-[#F5F5F5]"
                  )
                }
              >
                Leads
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A1A] text-[#F5F5F5] p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <h1 className="text-xl font-semibold">Welcome, {user?.email || 'Admin'}</h1>
          <button
            onClick={handleLogout}
            className="bg-[#DFFF00] text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 hover:opacity-90"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[#333333]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;