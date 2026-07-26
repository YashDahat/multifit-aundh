import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-[#1A1A1A] text-[#F5F5F5] py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-[#DFFF00]">
          MultiFit Aundh
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to={ROUTES.HOME} className="hover:text-[#DFFF00] transition-all duration-200">Home</Link>
          <Link to={ROUTES.MEMBERSHIPS} className="hover:text-[#DFFF00] transition-all duration-200">Memberships</Link>
          <Link to={ROUTES.SCHEDULE} className="hover:text-[#DFFF00] transition-all duration-200">Schedule</Link>
          <Link to={ROUTES.TRAINERS} className="hover:text-[#DFFF00] transition-all duration-200">Trainers</Link>
          <Link to={ROUTES.CONTACT} className="hover:text-[#DFFF00] transition-all duration-200">Contact</Link>
          {isAuthenticated && (
            <Link to={ROUTES.ADMIN_DASHBOARD} className="hover:text-[#DFFF00] transition-all duration-200">Admin</Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button
              onClick={logout}
              className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" className="text-[#F5F5F5] hover:text-[#DFFF00] transition-all duration-200">
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.MEMBERSHIPS}>
                <Button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}