import React from 'react';
import Layout from '@/components/Layout';

const ContactPage: React.FC = () => {
  // Placeholder for form submission logic, not explicitly requested to implement
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here (e.g., API call)
    console.log('Contact form submitted!');
  };

  // Coordinates for MultiFit Aundh, Pune, derived from Footer.tsx context
  const mapCoordinates = "18.562876,73.784422";
  // Note: A real application would use an environment variable for the API key
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?q=${mapCoordinates}&key=YOUR_GOOGLE_MAPS_API_KEY`;

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Get in Touch with MultiFit Aundh
          </h1>
          <p className="text-xl md:text-2xl text-white mt-4">
            We're here to answer your questions and help you start your fitness journey.
          </p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Our Location & Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-700 leading-relaxed">
                Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-700 leading-relaxed">075070 08009</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-700 leading-relaxed">info@multifitaundh.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Map Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Find Us on the Map
          </h2>
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapEmbedUrl}
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
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DFFF00] focus:border-[#DFFF00] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DFFF00] focus:border-[#DFFF00] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DFFF00] focus:border-[#DFFF00] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DFFF00] focus:border-[#DFFF00] sm:text-sm"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;