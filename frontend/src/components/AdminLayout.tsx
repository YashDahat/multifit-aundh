import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const baseNavLinkClasses = "py-2 px-4 block rounded-md transition-all duration-200";
  const inactiveNavLinkClasses = "text-[#F5F5F5] hover:bg-[#333333]";
  const activeNavLinkClasses = "bg-[#333333] text-[#DFFF00]";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center">MultiFit Aundh Admin</h2>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
                }
                end // Ensures this link is active only when the path is exactly /admin
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/trainers"
                className={({ isActive }) =>
                  `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
                }
              >
                Trainers
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/testimonials"
                className={({ isActive }) =>
                  `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
                }
              >
                Testimonials
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/admin/leads"
                className={({ isActive }) =>
                  `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
                }
              >
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