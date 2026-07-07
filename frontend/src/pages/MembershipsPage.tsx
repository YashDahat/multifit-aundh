import React from 'react';
import Layout from '@/components/Layout';
import { useAllMembershipPlans, usePurchaseMembership } from '../hooks/useMemberships';
import { Button } from '@/components/ui/button';

const MembershipsPage: React.FC = () => {
  const { data: membershipPlans, isLoading, isError } = useAllMembershipPlans();
  const purchaseMembershipMutation = usePurchaseMembership();

  const handlePurchase = (planId: string) => {
    purchaseMembershipMutation.mutate(planId);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5] mb-4">
            Unleash Your Potential at MultiFit Aundh
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Join our vibrant community and transform your fitness journey with flexible membership plans.
          </p>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Our Membership Plans</h2>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 animate-pulse h-64">
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-600 rounded-full w-full"></div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center text-red-400">
              Failed to load membership plans. Please try again later.
            </div>
          )}

          {!isLoading && !isError && membershipPlans && membershipPlans.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg">No membership plans available at the moment.</p>
              <p className="text-md">Please check back later!</p>
            </div>
          )}

          {!isLoading && !isError && membershipPlans && membershipPlans.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipPlans.map((plan) => (
                <div key={plan.id} className="bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5] flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-4xl font-bold text-[#DFFF00] mb-4">
                      {plan.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      <span className="text-lg text-gray-400"> / {plan.durationInMonths} months</span>
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-6">{plan.description}</p>
                  </div>
                  <Button
                    onClick={() => plan.id && handlePurchase(plan.id)}
                    className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full"
                    disabled={purchaseMembershipMutation.isPending || !plan.id}
                  >
                    {purchaseMembershipMutation.isPending ? 'Processing...' : 'Choose Plan'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5] text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Become a part of MultiFit Aundh today and experience fitness like never before.
          </p>
          <Button
            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Join MultiFit Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipsPage;