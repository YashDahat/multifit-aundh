import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1A1A] text-[#F5F5F5] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-[#DFFF00]">MultiFit</span> Aundh
            </Link>
          </div>

          {/* Desktop Navigation & CTA */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-[#DFFF00] transition-all duration-200">Home</Link>
              <Link to="/memberships" className="hover:text-[#DFFF00] transition-all duration-200">Memberships</Link>
              <Link to="/trainers" className="hover:text-[#DFFF00] transition-all duration-200">Trainers</Link>
            </div>
            <Link
              to="/"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Get a 3-Day Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#DFFF00]"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/memberships"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Memberships
            </Link>
            <Link
              to="/trainers"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Trainers
            </Link>
            <Link
              to="/"
              className="block w-full text-center mt-4 bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Get a 3-Day Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;