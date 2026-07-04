import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full py-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo/Name */}
        <Link href="/" className="text-2xl font-bold text-[#DFFF00]">
          MultiFit Aundh
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/memberships" className="hover:text-[#DFFF00] transition-all duration-200">
            Memberships
          </Link>
          <Link href="/schedule" className="hover:text-[#DFFF00] transition-all duration-200">
            Schedule
          </Link>
          <Link href="/trainers" className="hover:text-[#DFFF00] transition-all duration-200">
            Trainers
          </Link>
        </nav>

        {/* Desktop Call-to-Action Button */}
        <Link
          href="/trial"
          className="hidden md:block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
        >
          Get Free Trial
        </Link>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <button
          className="md:hidden text-[#F5F5F5] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] px-4 pb-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/memberships" className="block hover:text-[#DFFF00] transition-all duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Memberships
            </Link>
            <Link href="/schedule" className="block hover:text-[#DFFF00] transition-all duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Schedule
            </Link>
            <Link href="/trainers" className="block hover:text-[#DFFF00] transition-all duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Trainers
            </Link>
            <Link
              href="/trial"
              className="block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 text-center transition-all duration-200 mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Free Trial
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;