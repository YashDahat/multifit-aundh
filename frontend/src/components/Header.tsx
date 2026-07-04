import React from 'react';
import Link from 'next/link';

const Header = (): React.ReactElement => {
  return (
    <header className="sticky top-0 z-50 w-full py-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo/Name */}
        <Link href="/" className="text-2xl font-bold text-[#DFFF00]">
          MultiFit Aundh
        </Link>

        {/* Navigation Links (Desktop) */}
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

        {/* Call-to-Action Button (Desktop) */}
        <Link
          href="/trial"
          className="hidden md:block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
        >
          Get Free Trial
        </Link>

        {/* Mobile Menu Icon (Hamburger) */}
        <div className="md:hidden">
          <button className="text-[#F5F5F5] focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;