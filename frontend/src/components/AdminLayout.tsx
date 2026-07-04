import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-4 block rounded-md transition-all duration-200 ${
      isActive
        ? 'bg-[#333333] text-[#DFFF00]'
        : 'text-[#F5F5F5] hover:bg-[#333333]'
    }`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center">MultiFit Aundh Admin</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <li>
              <NavLink to="/admin" className={navLinkClass} end>
                Dashboard
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink to="/admin/trainers" className={navLinkClass}>
                Trainers
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink to="/admin/testimonials" className={navLinkClass}>
                Testimonials
              </NavLink>
            </li>
            <li className="mt-2">
              <NavLink to="/admin/leads" className={navLinkClass}>
                Leads
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;