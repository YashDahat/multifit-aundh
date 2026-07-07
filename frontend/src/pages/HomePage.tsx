import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import { TrialForm } from '../components/TrialForm';
import TestimonialsSection from '../components/TestimonialsSection';
import SocialFeed from '../components/SocialFeed';

const HomePage: React.FC = () => {
  const trialFormRef = useRef<HTMLDivElement>(null);

  const scrollToTrialForm = () => {
    trialFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const classHighlights = [
    {
      title: 'High-Intensity Interval Training',
      description: 'Push your limits with dynamic, fast-paced workouts designed to burn fat and build endurance.',
      image: 'https://images.unsplash.com/photo-1571019625476-f3d46499b691?w=800&q=80',
    },
    {
      title: 'Yoga & Flexibility',
      description: 'Improve your balance, strength, and mental clarity with our diverse range of yoga classes.',
      image: 'https://images.unsplash.com/photo-1545389336-cf0978640360?w=800&q=80',
    },
    {
      title: 'Strength & Conditioning',
      description: 'Build muscle, increase power, and enhance overall athletic performance with expert guidance.',
      image: 'https://images.unsplash.com/photo-1590487988256-9dd3b2d862d5?w=800&q=80',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#DFFF00] mb-4">
            UNLEASH YOUR POTENTIAL AT MULTIFIT AUNDH
          </h1>
          <p className="text-[#F5F5F5] leading-relaxed text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Experience the energy, embrace the community. Your fitness journey starts here.
          </p>
          <button
            onClick={scrollToTrialForm}
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200"
          >
            START YOUR 3-DAY FREE TRIAL
          </button>
        </div>
      </section>

      {/* Trial Form Section */}
      <section ref={trialFormRef} className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            CLAIM YOUR FREE 3-DAY TRIAL
          </h2>
          <p className="text-[#F5F5F5] leading-relaxed mb-8 max-w-xl mx-auto">
            Sign up now and experience the difference. No commitments, just pure fitness.
          </p>
          <div className="max-w-md mx-auto bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6">
            <TrialForm />
          </div>
        </div>
      </section>

      {/* Class Highlights Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            OUR CLASSES: FIND YOUR FIRE.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {classHighlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5] overflow-hidden"
              >
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-[#DFFF00] mb-2">{highlight.title}</h3>
                <p className="leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Social Feed Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-12">
            JOIN THE MULTIFIT AUNDH COMMUNITY ONLINE.
          </h2>
          <SocialFeed />
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;