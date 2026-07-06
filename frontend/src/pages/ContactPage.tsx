import React from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

const ContactPage: React.FC = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=18.562876,73.799898`;

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F5F5F5] leading-tight">
            Get in Touch with MultiFit Aundh
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F5F5] opacity-90 mt-4">
            We're here to answer your questions and help you start your fitness journey.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-8">
            Visit Us or Give Us a Call
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[#333333]">
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-2">Address</h3>
              <p>Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-2">Phone</h3>
              <p>075070 08009</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-2">Opening Hours</h3>
              <p>Mon-Sat: 6 AM - 10 PM</p>
              <p>Sun: 8 AM - 6 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:py-24 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-8">
            Send Us a Message
          </h2>
          <form className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-[#333333] mb-2">Name</Label>
              <Input type="text" id="name" placeholder="Your Name" className="w-full" />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">Email</Label>
              <Input type="email" id="email" placeholder="your@example.com" className="w-full" />
            </div>
            <div>
              <Label htmlFor="subject" className="block text-sm font-medium text-[#333333] mb-2">Subject</Label>
              <Input type="text" id="subject" placeholder="Subject of your message" className="w-full" />
            </div>
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-[#333333] mb-2">Message</Label>
              <textarea
                id="message"
                rows={5}
                placeholder="Your message here..."
                className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
            <Button type="submit" className="w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 shadow-lg">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-8">
            Find Us Easily
          </h2>
          <div className="relative h-[400px] md:h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {googleMapsApiKey ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MultiFit Aundh Location"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600">
                Google Maps API Key not configured.
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;