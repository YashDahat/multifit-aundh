import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full py-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo/Name */}
        <Link href="/" className="text-2xl font-bold text-[#DFFF00]">
          MultiFit Aundh
        </Link>

        {/* Desktop Navigation Links and CTA */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/memberships" className="hover:text-[#DFFF00] transition-colors duration-200">
            Memberships
          </Link>
          <Link href="/schedule" className="hover:text-[#DFFF00] transition-colors duration-200">
            Schedule
          </Link>
          <Link href="/trainers" className="hover:text-[#DFFF00] transition-colors duration-200">
            Trainers
          </Link>
          <Link
            href="/trial"
            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Get Free Trial
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F5F5F5] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            // Close icon (X)
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] px-4 pt-2 pb-4 space-y-4">
          <Link
            href="/memberships"
            className="block text-[#F5F5F5] hover:text-[#DFFF00] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Memberships
          </Link>
          <Link
            href="/schedule"
            className="block text-[#F5F5F5] hover:text-[#DFFF00] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Schedule
          </Link>
          <Link
            href="/trainers"
            className="block text-[#F5F5F5] hover:text-[#DFFF00] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trainers
          </Link>
          <Link
            href="/trial"
            className="block text-center bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Free Trial
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;