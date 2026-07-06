import type { JSX } from 'react';
import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Business Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  <span className="text-[#DFFF00]">MultiFit</span> Aundh
                </h3>
                <p className="mb-2">Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067</p>
                <p className="mb-2">Phone: 075070 08009</p>
                <p>Mon-Sat: 6 AM - 10 PM | Sun: 8 AM - 6 PM</p>
              </div>
    
              {/* Social Media Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-[#F5F5F5] hover:text-[#DFFF00] transition-all duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#F5F5F5] hover:text-[#DFFF00] transition-all duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 0C8.74 0 8.333.01 7.02.06 5.71.11 5.04.29 4.4.54 3.75.79 3.16.99 2.62 1.29 2.07 1.6 1.57 2.01 1.14 2.44.71 2.87.3 3.37.09 3.92.03 4.47 0 5.14 0 6.45 0 8.74 0 12s-.01 3.26-.06 4.58c-.05 1.31-.23 1.98-.48 2.62-.25.65-.45 1.24-.75 1.79-.31.55-.72 1.05-1.15 1.48-.43.43-.93.84-1.48 1.15-.55.3-1.14.5-1.79.75-.64.25-1.31.43-2.62.48-1.31.05-1.72.06-4.58.06s-3.26-.01-4.58-.06c-1.31-.05-1.98-.23-2.62-.48-.65-.25-1.24-.45-1.79-.75-.55-.3-1.05-.72-1.48-1.15-.43-.43-.84-.93-1.15-1.48-.3-.55-.5-1.14-.75-1.79-.25-.64-.43-1.31-.48-2.62-.05-1.31-.06-1.72-.06-4.58s.01-3.26.06-4.58c.05-1.31.23-1.98.48-2.62.25-.65.45-1.24.75-1.79.31-.55.72-1.05 1.15-1.48.43-.43.93-.84 1.48-1.15.55-.3 1.14-.5 1.79-.75.64-.25 1.31-.43 2.62-.48C8.333.01 8.74 0 12 0zm0 2.16c-3.2.01-3.58.01-4.85.06-1.26.05-1.8.23-2.18.38-.39.15-.67.33-.92.58-.25.25-.43.53-.58.92-.15.38-.33.92-.38 2.18-.05 1.27-.06 1.65-.06 4.85s.01 3.58.06 4.85c.05 1.26.23 1.8.38 2.18.15.39.33.67.58.92.25.25.43.53.58.92.15.38.33.92.38 2.18.05 1.27.06 1.65.06 4.85s-.01 3.58-.06 4.85c-.05-1.26-.23-1.8-.38-2.18-.15-.39-.33-.67-.58-.92-.25-.25-.53-.43-.92-.58-.38-.15-.92-.33-2.18-.38C15.58 2.17 15.2 2.16 12 2.16zm0 3.63c-3.46 0-6.26 2.8-6.26 6.26s2.8 6.26 6.26 6.26 6.26-2.8 6.26-6.26-2.8-6.26-6.26-6.26zm0 10.3c-2.23 0-4.04-1.81-4.04-4.04s1.81-4.04 4.04-4.04 4.04 1.81 4.04 4.04-1.81 4.04-4.04 4.04zm6.4-11.22c-.82 0-1.49-.67-1.49-1.49s.67-1.49 1.49-1.49 1.49.67 1.49 1.49-.67 1.49-1.49 1.49z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#F5F5F5] hover:text-[#DFFF00] transition-all duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.515 8.816v-4.66l4.702 2.33-4.702 2.33z" />
                    </svg>
                  </a>
                </div>
              </div>
    
              {/* Google Map */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Our Location</h3>
                <div className="aspect-w-16 aspect-h-9 w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=18.562876,73.799898`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MultiFit Aundh Location"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
              &copy; {new Date().getFullYear()} MultiFit Aundh. All rights reserved.
            </div>
          </div>
        </footer>
  );
}
