import React from 'react';
import Layout from '../components/Layout';
import TrialForm from '../components/TrialForm';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5] mb-4">
            MultiFit Aundh: Your Antidote to Boring Gyms
          </h1>
          <p className="text-[#F5F5F5] text-xl md:text-2xl mb-8">
            Unleash Your Potential. Join Our Vibrant Community Today!
          </p>
          <a
            href="#trial-form"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Start Your 3-Day Free Trial
          </a>
        </div>
      </section>

      {/* "Experience the Difference" Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">
            Experience the MultiFit Aundh Difference
          </h2>
          <p className="text-[#1A1A1A] leading-relaxed max-w-3xl mx-auto">
            Step into MultiFit Aundh and discover a fitness journey unlike any other. We combine
            state-of-the-art facilities with a supportive, high-energy community to help you
            achieve your health and wellness goals. From personalized training to diverse group
            classes, we offer everything you need to transform your body and mind. Say goodbye to
            monotonous workouts and embrace a vibrant, results-driven environment.
          </p>
        </div>
      </section>

      {/* "Your Free Trial Awaits" Section */}
      <section id="trial-form" className="py-16 px-4 bg-[#333333]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#F5F5F5] mb-8">
            Your Journey Starts Here: Claim Your 3-Day Free Trial
          </h2>
          <div className="max-w-lg mx-auto">
            <TrialForm />
          </div>
        </div>
      </section>

      {/* "Diverse Classes for Every Goal" Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">
            Diverse Classes for Every Goal
          </h2>
          <p className="text-[#1A1A1A] leading-relaxed max-w-3xl mx-auto mb-8">
            Whether you're looking to build strength, improve flexibility, or boost your endurance,
            MultiFit Aundh has a class for you. Dive into high-intensity interval training (HIIT),
            find your flow with yoga, sculpt your physique with strength training, or dance your
            way to fitness with Zumba. Our expert instructors guide you through every session,
            ensuring a challenging yet rewarding experience.
          </p>
          <Link
            to="/memberships"
            className="border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"
          >
            Explore All Classes
          </Link>
        </div>
      </section>

      {/* "Meet Our Expert Trainers" Section */}
      <section className="py-16 px-4 bg-[#333333]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#F5F5F5] mb-8">
            Meet Our Expert Trainers
          </h2>
          <p className="text-[#F5F5F5] leading-relaxed max-w-3xl mx-auto mb-8">
            Our team of certified and passionate trainers is dedicated to your success. With years
            of experience and a deep understanding of fitness science, they provide personalized
            guidance, motivation, and support to help you surpass your limits. From beginners to
            advanced athletes, our trainers are here to craft effective workout plans and ensure
            you achieve optimal results safely and efficiently.
          </p>
          <Link
            to="/trainers"
            className="border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"
          >
            View All Trainers
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">
            What Our Members Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-left">
              <p className="text-[#1A1A1A] leading-relaxed italic mb-4">
                "MultiFit Aundh changed my life! The trainers are incredibly supportive, and the
                community is so welcoming. I've achieved fitness goals I never thought possible."
              </p>
              <p className="font-semibold text-[#1A1A1A]">- Priya S.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-left">
              <p className="text-[#1A1A1A] leading-relaxed italic mb-4">
                "Finally, a gym that makes working out fun! The variety of classes keeps me engaged,
                and I love the energy. Highly recommend for anyone tired of boring routines."
              </p>
              <p className="font-semibold text-[#1A1A1A]">- Rohan K.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-left">
              <p className="text-[#1A1A1A] leading-relaxed italic mb-4">
                "The facilities are top-notch, and the staff genuinely cares about your progress.
                It's more than just a gym; it's a fitness family. Best decision I ever made!"
              </p>
              <p className="font-semibold text-[#1A1A1A]">- Anjali M.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;