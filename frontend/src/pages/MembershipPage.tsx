import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMembershipPlans } from '../hooks/useMemberships';
import clsx from 'clsx';

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: membershipPlans, isLoading, isError, error } = useMembershipPlans();

  const handleJoinNowClick = () => {
    navigate('/signup');
  };

  const handleSelectPlanClick = (planId: string) => {
    // In a real application, this would navigate to a checkout or subscription flow
    console.log(`Selected plan: ${planId}`);
    navigate(`/checkout?planId=${planId}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center bg-[#1A1A1A] text-[#F5F5F5]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#DFFF00]">
            Unleash Your Potential at MultiFit Aundh!
          </h1>
          <p className="text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-3xl mx-auto">
            Choose a membership that fuels your fitness journey. No boring routines, just pure energy and results.
          </p>
          <button
            onClick={handleJoinNowClick}
            className="mt-8 bg-[#DFFF00] hover:bg-[#cce000] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Join Now
          </button>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#DFFF00] mb-8 text-center">
            Our Membership Plans
          </h2>

          {isLoading && (
            <div className="text-center text-xl text-[#F5F5F5]">Loading membership plans...</div>
          )}

          {isError && (
            <div className="text-center text-xl text-red-500">
              Failed to load membership plans. Please try again later. {error?.message}
            </div>
          )}

          {membershipPlans && membershipPlans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#1A1A1A] rounded-xl shadow-lg border border-[#333333] p-6 text-[#F5F5F5] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-[#DFFF00] mb-2">{plan.name}</h3>
                    <p className="text-xl font-semibold text-[#F5F5F5] mb-4">
                      Rs. {plan.price} / {plan.durationMonths} Months
                    </p>
                    <p className="text-base text-[#F5F5F5] leading-relaxed mb-4">
                      {plan.description}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-[#F5F5F5]">
                          <svg
                            className="w-5 h-5 text-[#DFFF00] mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleSelectPlanClick(plan.id)}
                    className="mt-auto bg-[#DFFF00] hover:bg-[#cce000] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {membershipPlans && membershipPlans.length === 0 && !isLoading && !isError && (
            <div className="text-center text-xl text-[#F5F5F5]">No membership plans available at the moment.</div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPage;