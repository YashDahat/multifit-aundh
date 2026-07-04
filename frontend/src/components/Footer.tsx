const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: About MultiFit Aundh */}
        <div>
          <h3 className="text-xl font-semibold text-[#DFFF00] mb-4">MultiFit Aundh</h3>
          <p className="text-gray-300 leading-relaxed">
            Your journey to a stronger, healthier you starts here. Experience the difference of a high-energy, community-focused fitness environment.
          </p>
        </div>

        {/* Column 2: Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-[#DFFF00] mb-4">Contact Us</h3>
          <p className="mb-2 text-gray-300">
            Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
          </p>
          <p className="mb-4 text-gray-300">
            Phone: <a href="tel:07507008009" className="hover:text-[#DFFF00] transition-all duration-200">075070 08009</a>
          </p>
          <h4 className="font-semibold text-[#DFFF00] mb-2">Opening Hours:</h4>
          <ul className="text-gray-300">
            <li>Monday - Friday: 6:00 AM - 10:00 PM</li>
            <li>Saturday: 7:00 AM - 8:00 PM</li>
            <li>Sunday: 8:00 AM - 6:00 PM</li>
          </ul>
        </div>

        {/* Column 3: Location Map */}
        <div>
          <h3 className="text-xl font-semibold text-[#DFFF00] mb-4">Find Us</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.392934091012!2d73.78458731493086!3d18.562876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2a6f2b2e8f%3A0x8f2b2e8f8f2b2e8f!2sMultifit%20Aundh!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
        © {currentYear} MultiFit Aundh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;