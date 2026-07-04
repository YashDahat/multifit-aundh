import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#333333] text-[#F5F5F5] p-4 flex flex-col justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-[#DFFF00]">MultiFit Aundh Admin</h1>
          <nav>
            <ul>
              <li className="mb-2">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    clsx(
                      'block p-2 rounded-md transition-all duration-200',
                      isActive ? 'bg-[#1A1A1A] text-[#DFFF00]' : 'text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#DFFF00]'
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
                      'block p-2 rounded-md transition-all duration-200',
                      isActive ? 'bg-[#1A1A1A] text-[#DFFF00]' : 'text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#DFFF00]'
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
                      'block p-2 rounded-md transition-all duration-200',
                      isActive ? 'bg-[#1A1A1A] text-[#DFFF00]' : 'text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#DFFF00]'
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
                      'block p-2 rounded-md transition-all duration-200',
                      isActive ? 'bg-[#1A1A1A] text-[#DFFF00]' : 'text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#DFFF00]'
                    )
                  }
                >
                  Leads
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="block w-full text-left p-2 rounded-md text-[#F5F5F5] bg-transparent hover:bg-red-700 hover:text-white transition-all duration-200 mt-auto"
        >
          Logout
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-[#F5F5F5] overflow-y-auto text-gray-800 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;