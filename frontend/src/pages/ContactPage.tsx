import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579758782992-0676458399e5?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#DFFF00]">
            GET IN TOUCH WITH MULTIFIT AUNDH
          </h1>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">CONTACT US</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold text-[#DFFF00] mb-2">Address</h3>
              <p className="leading-relaxed">
                Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#DFFF00] mb-2">Phone</h3>
              <p className="leading-relaxed">075070 08009</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#DFFF00] mb-2">Opening Hours</h3>
              <p className="leading-relaxed">Monday - Saturday: 6:00 AM - 10:00 PM</p>
              <p className="leading-relaxed">Sunday: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">SEND US A MESSAGE</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="mt-1 block w-full bg-[#1A1A1A] border border-[#333333] text-[#F5F5F5] placeholder:text-[#A0A0A0]"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="mt-1 block w-full bg-[#1A1A1A] border border-[#333333] text-[#F5F5F5] placeholder:text-[#A0A0A0]"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your inquiry"
                className="mt-1 block w-full bg-[#1A1A1A] border border-[#333333] text-[#F5F5F5] placeholder:text-[#A0A0A0]"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={5}
                className="mt-1 block w-full bg-[#1A1A1A] border border-[#333333] text-[#F5F5F5] placeholder:text-[#A0A0A0]"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200"
            >
              SEND MESSAGE
            </Button>
          </form>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">FIND US HERE</h2>
          <GoogleMapsEmbed latitude={18.562876} longitude={73.784389} />
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;