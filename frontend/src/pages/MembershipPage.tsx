import React from 'react';
import Layout from '@/components/Layout';
import { useMemberships } from '../hooks/useMemberships';

const MembershipPage: React.FC = () => {
  const { data: membershipPlans, isLoading, isError, error } = useMemberships();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Unleash Your Potential at MultiFit Aundh
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
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
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            Choose Your Path to <span className="text-[#DFFF00]">Fitness</span>
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            Find the perfect membership to match your ambition and lifestyle. Each plan is designed to help you thrive.
          </p>

          {isLoading && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Loading plans...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <p className="text-xl text-red-600">Error loading membership plans: {error?.message}</p>
            </div>
          )}

          {!isLoading && !isError && (!membershipPlans || membershipPlans.length === 0) && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No membership plans available at the moment. Please check back later!</p>
            </div>
          )}

          {!isLoading && !isError && membershipPlans && membershipPlans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                  <p className="text-4xl font-extrabold text-[#DFFF00] mb-2">
                    ₹{plan.price}
                  </p>
                  <p className="text-lg text-gray-600 mb-4">{plan.durationMonths} Month Plan</p>
                  <p className="text-gray-700 mb-6 leading-relaxed flex-grow">{plan.description}</p>
                  <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button className="bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full text-center mt-auto">
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