import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Assuming AuthContext is in a sibling 'auth-ui' folder
import clsx from 'clsx';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const navLinks = (
    <>
      <Link to="/" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
      <Link to="/memberships" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Memberships</Link>
      <Link to="/schedule" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
      <Link to="/trainers" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Trainers</Link>
      <Link to="/about" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
      <Link to="/contact" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
      {isAuthenticated ? (
        <>
          <Link to="/admin" className="hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
          <button
            onClick={handleLogout}
            className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-[#1A1A1A] text-[#F5F5F5] p-4 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="text-[#DFFF00]">MultiFit</span>
          <span className="text-[#F5F5F5]">Aundh</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#F5F5F5] focus:outline-none">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={clsx(
          "fixed inset-0 bg-[#1A1A1A] z-50 flex flex-col items-center justify-center space-y-6 text-xl transition-transform duration-300 ease-in-out transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-[#F5F5F5] focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {navLinks}
      </nav>
    </header>
  );
};

export default Header;