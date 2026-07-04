import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  label: string;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, exact }) => {
  const router = useRouter();
  const isActive = exact ? router.pathname === href : router.pathname.startsWith(href);

  const baseNavLinkClasses = "py-2 px-4 block rounded-md transition-all duration-200";
  const inactiveNavLinkClasses = "text-[#F5F5F5] hover:bg-[#333333]";
  const activeNavLinkClasses = "bg-[#333333] text-[#DFFF00]";

  return (
    <li className="mb-2">
      <Link
        href={href}
        className={`${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
      >
        {label}
      </Link>
    </li>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center">MultiFit Aundh Admin</h2>
        </div>
        <nav className="flex-grow">
          <ul>
            <NavItem href="/admin" label="Dashboard" exact />
            <NavItem href="/admin/trainers" label="Trainers" />
            <NavItem href="/admin/testimonials" label="Testimonials" />
            <NavItem href="/admin/leads" label="Leads" />
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
