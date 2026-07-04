import React from 'react';
import Layout from '../components/Layout';
import TrialForm from '../components/TrialForm';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center p-4 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5] mb-4">
            MultiFit Aundh: Your Antidote to Boring Gyms
          </h1>
          <p className="text-[#F5F5F5] text-xl md:text-2xl mt-4 mb-8">
            Unleash Your Potential. Join Our Vibrant Community Today!
          </p>
          <Link
            to="/"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Start Your 3-Day Free Trial
          </Link>
        </div>
      </section>

      {/* "Experience the Difference" Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
            Experience the MultiFit Aundh Difference
          </h2>
          <p className="text-[#1A1A1A] leading-relaxed max-w-3xl mx-auto">
            At MultiFit Aundh, we believe fitness should be exciting, engaging, and effective.
            Our state-of-the-art facilities, diverse range of classes, and supportive community
            are designed to help you break free from monotonous routines and achieve your personal
            best. Discover a place where every workout is a step towards a stronger, healthier you.
          </p>
        </div>
      </section>

      {/* "Your Free Trial Awaits" Section */}
      <section className="py-16 px-4 bg-[#333333]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mb-8">
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
            Diverse Classes for Every Goal
          </h2>
          <p className="text-[#1A1A1A] leading-relaxed max-w-3xl mx-auto mb-8">
            Whether you're into high-intensity interval training, calming yoga, powerful strength
            training, or energetic Zumba, MultiFit Aundh has a class for you. Our expert instructors
            guide you through dynamic workouts designed to challenge and inspire, ensuring you never
            get bored and always see results.
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mb-8">
            Meet Our Expert Trainers
          </h2>
          <p className="text-[#F5F5F5] leading-relaxed max-w-3xl mx-auto mb-8">
            Our team of certified and passionate trainers is dedicated to guiding you on your
            fitness journey. With personalized attention and innovative training methods, they'll
            help you push your limits, refine your technique, and achieve your fitness aspirations.
            Get ready to be inspired and transform with the best in the business.
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
            What Our Members Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#1A1A1A] leading-relaxed">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-4">
                "MultiFit Aundh changed my perception of gyms. The community is incredibly supportive,
                and the classes are always challenging and fun. I've seen amazing results!"
              </p>
              <p className="font-semibold">- Priya S.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-4">
                "The trainers here are top-notch. They genuinely care about your progress and push
                you to be your best. Highly recommend for anyone serious about fitness."
              </p>
              <p className="font-semibold">- Rahul K.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-4">
                "Finally, a gym that isn't boring! The variety of classes keeps me motivated, and
                the facilities are excellent. It's more than just a gym, it's a fitness family."
              </p>
              <p className="font-semibold">- Anjali M.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;