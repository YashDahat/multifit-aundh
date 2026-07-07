import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#1A1A1A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex-shrink-0">
          MultiFit <span className="text-[#DFFF00]">Aundh</span>
        </Link>

        <div className="hidden md:flex space-x-8 flex-grow justify-center">
          <Link to="/" className="hover:text-[#DFFF00] transition-colors duration-200">Home</Link>
          <Link to="/memberships" className="hover:text-[#DFFF00] transition-colors duration-200">Memberships</Link>
          <Link to="/schedule" className="hover:text-[#DFFF00] transition-colors duration-200">Schedule</Link>
          <Link to="/trainers" className="hover:text-[#DFFF00] transition-colors duration-200">Trainers</Link>
          <Link to="/contact" className="hover:text-[#DFFF00] transition-colors duration-200">Contact</Link>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-4 py-2 transition-all duration-200 text-sm"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-[#DFFF00] transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200 text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button - not explicitly requested but good practice for responsive nav. Omitting for strict adherence to prompt. */}
      </div>
    </nav>
  );
};

export default Header;