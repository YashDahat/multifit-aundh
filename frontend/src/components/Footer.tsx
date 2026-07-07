import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand and Contact Info */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">MultiFit Aundh</h3>
          <p className="mb-2 leading-relaxed">
            Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
          </p>
          <p className="mb-2">Phone: 075070 08009</p>
          <p>Mon-Fri: 6 AM - 10 PM, Sat-Sun: 8 AM - 8 PM</p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFFF00] transition-all duration-200 flex items-center">
                <span className="mr-2">📘</span> Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFFF00] transition-all duration-200 flex items-center">
                <span className="mr-2">📸</span> Instagram
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFFF00] transition-all duration-200 flex items-center">
                <span className="mr-2">🐦</span> Twitter
              </a>
            </li>
          </ul>
        </div>

        {/* Sitemap */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Sitemap</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-[#DFFF00] transition-all duration-200">Home</Link>
            </li>
            <li>
              <Link to="/memberships" className="hover:text-[#DFFF00] transition-all duration-200">Memberships</Link>
            </li>
            <li>
              <Link to="/schedule" className="hover:text-[#DFFF00] transition-all duration-200">Schedule</Link>
            </li>
            <li>
              <Link to="/trainers" className="hover:text-[#DFFF00] transition-all duration-200">Trainers</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#DFFF00] transition-all duration-200">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;