import React from 'react';
import Layout from '@/components/Layout';
import { useMemberships } from '../hooks/useMemberships';
import clsx from 'clsx';

const MembershipPage: React.FC = () => {
  const { data: plans, isLoading, isError, error } = useMemberships();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Potential at MultiFit Aundh</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our vibrant community and transform your fitness journey. Choose the plan that powers your goals.
          </p>
          <button className="bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-gray-800">
            Choose Your Path to <span className="text-[#DFFF00]">Fitness</span>
          </h2>
          <p className="text-center mb-10 text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Find the perfect membership to match your ambition and lifestyle. Each plan is designed to help you thrive.
          </p>

          {isLoading && <p className="text-center text-gray-700">Loading plans...</p>}
          {isError && <p className="text-center text-red-600">Error loading membership plans: {error?.message}</p>}

          {!isLoading && !isError && plans && plans.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No membership plans available at the moment. Please check back later!</p>
            </div>
          )}

          {!isLoading && !isError && plans && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{plan.name}</h3>
                  <p className="text-3xl font-bold text-[#DFFF00] mb-2">₹{plan.price} <span className="text-lg text-gray-600">/ month</span></p>
                  <p className="text-gray-600 mb-4">{plan.durationMonths} Month Plan</p>
                  <p className="text-gray-700 leading-relaxed mb-4 flex-grow">{plan.description}</p>
                  <ul className="list-none space-y-2 mb-6 text-gray-700">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-[#DFFF00] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 mt-auto w-full">
                    Join Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPage;