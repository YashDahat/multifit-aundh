import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About MultiFit Aundh */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#DFFF00]">About MultiFit Aundh</h3>
            <p className="text-sm leading-relaxed">
              MultiFit Aundh is your ultimate fitness destination, dedicated to helping you achieve your goals in a high-energy, supportive community. Unleash your potential with us!
            </p>
          </div>

          {/* Column 2: Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#DFFF00]">Contact Us</h3>
            <p className="text-sm mb-2">
              <strong className="block">Address:</strong> Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
            </p>
            <p className="text-sm mb-2">
              <strong className="block">Phone:</strong> 075070 08009
            </p>
            <p className="text-sm">
              <strong className="block">Opening Hours:</strong> Please contact us for current hours.
            </p>
          </div>

          {/* Column 3: Location Map */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#DFFF00]">Our Location</h3>
            <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://maps.google.com/maps?q=18.562876,73.783691&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="MultiFit Aundh Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
          © {currentYear} MultiFit Aundh. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;