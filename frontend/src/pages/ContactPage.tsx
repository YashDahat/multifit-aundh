import Layout from '@/components/Layout';

const ContactPage = () => {
  const address = "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067";
  const phoneNumber = "075070 08009";
  const openingHours = "Monday - Friday: 6:00 AM - 10:00 PM, Saturday - Sunday: 8:00 AM - 8:00 PM";
  const coordinates = { lat: 18.562876, lng: 73.799999 };

  return (
    <Layout>
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-700 mb-8">We'd love to hear from you! Reach out to us with any questions or inquiries.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Location</h2>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> {address}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> <a href={`tel:${phoneNumber}`} className="text-[#DFFF00] hover:underline">{phoneNumber}</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Opening Hours:</strong> {openingHours}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Find Us on the Map</h2>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  title="Google Map of MultiFit Aundh"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.164539150009!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf36f9a00001%3A0x8f0d8b0d8b0d8b0d!2sMultifit%20Aundh!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;