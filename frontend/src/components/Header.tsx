import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A] text-[#F5F5F5] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand Name */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-[#DFFF00]">MultiFit</span> Aundh
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/memberships" className="hover:text-[#DFFF00] transition-colors duration-200">Memberships</Link>
          <Link to="/schedule" className="hover:text-[#DFFF00] transition-colors duration-200">Schedule</Link>
          <Link to="/trainers" className="hover:text-[#DFFF00] transition-colors duration-200">Trainers</Link>
          <Link to="/contact" className="hover:text-[#DFFF00] transition-colors duration-200">Contact</Link>
          {/* Primary CTA Button */}
          <Link
            to="/memberships"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Join Now
          </Link>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#F5F5F5] focus:outline-none"
            aria-label="Toggle mobile menu"
          >
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

      {/* Mobile Navigation (Drawer/Modal) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#1A1A1A] pb-4">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/memberships" className="block py-2 hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Memberships</Link>
            <Link to="/schedule" className="block py-2 hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
            <Link to="/trainers" className="block py-2 hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Trainers</Link>
            <Link to="/contact" className="block py-2 hover:text-[#DFFF00] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link
              to="/memberships"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200 mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;