import React from 'react';
import Layout from '@/components/Layout';
import TrialForm from '@/components/TrialForm';
import TestimonialsSection from '@/components/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F5F5F5] leading-tight">
            Unleash Your Potential at MultiFit Aundh
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F5F5] opacity-90 mt-4">
            Experience high-energy workouts, expert trainers, and a supportive community.
          </p>
          <a
            href="#trial-form"
            className="mt-8 inline-block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 shadow-lg"
          >
            Start Your Free 3-Day Trial
          </a>
        </div>
      </section>

      {/* Trial Form Section */}
      <section id="trial-form" className="bg-[#F5F5F5] py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
            Claim Your Free 3-Day Trial
          </h2>
          <p className="text-lg text-[#333333] leading-relaxed mb-12">
            Experience MultiFit Aundh firsthand. No commitments, just pure fitness.
          </p>
          <TrialForm />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <TestimonialsSection />
        </div>
      </section>

      {/* Class Highlights Section */}
      <section className="bg-[#F5F5F5] py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
            Our Signature Classes
          </h2>
          <p className="text-lg text-[#333333] leading-relaxed mb-12">
            From high-intensity interval training to calming yoga, find your perfect fit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1571019625454-f42116010046?w=800&q=80"
                alt="HIIT Class"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">High-Intensity Interval Training (HIIT)</h3>
              <p className="text-[#333333] leading-relaxed">
                Maximize your calorie burn and boost your metabolism with our dynamic HIIT sessions.
              </p>
            </div>

            {/* Placeholder Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544367520-99c465a11160?w=800&q=80"
                alt="Yoga Class"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Yoga & Flexibility</h3>
              <p className="text-[#333333] leading-relaxed">
                Improve your strength, balance, and mental clarity with our rejuvenating yoga classes.
              </p>
            </div>

            {/* Placeholder Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1594381830691-893264627447?w=800&q=80"
                alt="Strength Training"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Strength & Conditioning</h3>
              <p className="text-[#333333] leading-relaxed">
                Build muscle, increase endurance, and sculpt your body with expert-led strength training.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;