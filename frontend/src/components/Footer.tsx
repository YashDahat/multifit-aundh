import type { JSX } from 'react';
import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5]">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-2">
              Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
            </p>
            <p className="text-gray-300">Phone: 075070 08009</p>
          </div>
    
          {/* Column 2: Opening Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <p className="text-gray-300">Mon - Fri: 6 AM - 10 PM</p>
            <p className="text-gray-300">Sat - Sun: 8 AM - 8 PM</p>
          </div>
    
          {/* Column 3: Location Map */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Find Us</h3>
            <div className="relative w-full h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.261317992764!2d73.784592!3d18.562876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2a67e00001%3A0x1234567890abcdef!2sMultiFit%20Aundh!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MultiFit Aundh Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
