import { Link } from 'react-router-dom';
import { routeTable } from '@/routes';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const adminNavRoutes = routeTable.filter(route => route.nav && route.admin);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Admin Panel</h2>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {adminNavRoutes.map((route) => (
              <li key={route.path}>
                <Button asChild variant="ghost" className="w-full justify-start text-lg">
                  <Link to={route.path}>{route.nav}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <Separator className="my-4" />
        <Button variant="ghost" className="w-full justify-start text-lg text-red-600 hover:text-red-700" onClick={logout}>
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;