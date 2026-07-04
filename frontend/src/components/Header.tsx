import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg hover:text-[#DFFF00] transition-colors duration-200 ${
                  isActive ? 'text-[#DFFF00]' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/memberships"
              className={({ isActive }) =>
                `text-lg hover:text-[#DFFF00] transition-colors duration-200 ${
                  isActive ? 'text-[#DFFF00]' : ''
                }`
              }
            >
              Memberships
            </NavLink>
            <NavLink
              to="/trainers"
              className={({ isActive }) =>
                `text-lg hover:text-[#DFFF00] transition-colors duration-200 ${
                  isActive ? 'text-[#DFFF00]' : ''
                }`
              }
            >
              Trainers
            </NavLink>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Get a 3-Day Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#1A1A1A] z-40 flex flex-col items-center justify-center space-y-6 py-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F5F5F5] hover:text-[#DFFF00] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Link to="/" className="text-3xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-[#DFFF00]">MultiFit</span> Aundh
          </Link>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl hover:text-[#DFFF00] transition-colors duration-200 ${
                isActive ? 'text-[#DFFF00]' : ''
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/memberships"
            className={({ isActive }) =>
              `text-2xl hover:text-[#DFFF00] transition-colors duration-200 ${
                isActive ? 'text-[#DFFF00]' : ''
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Memberships
          </NavLink>
          <NavLink
            to="/trainers"
            className={({ isActive }) =>
              `text-2xl hover:text-[#DFFF00] transition-colors duration-200 ${
                isActive ? 'text-[#DFFF00]' : ''
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trainers
          </NavLink>

          <Link
            to="/"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 text-lg mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get a 3-Day Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;