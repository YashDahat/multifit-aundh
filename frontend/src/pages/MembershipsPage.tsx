import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAllMemberships } from '../hooks/useMemberships';
import { Loader2 } from 'lucide-react';

const MembershipsPage: React.FC = () => {
  const { data: memberships, isLoading, isError, error } = useAllMemberships();
  const plansSectionRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            Ignite Your Potential at MultiFit Aundh!
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-[#F5F5F5] max-w-3xl mx-auto leading-relaxed">
            Choose a membership that fuels your fitness journey. Bold. Energetic. Unstoppable.
          </p>
          <Button
            onClick={scrollToPlans}
            className="bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 mt-8"
          >
            View Our Plans
          </Button>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section ref={plansSectionRef} className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-gray-800">
            Our Membership Plans
          </h2>
          <p className="text-gray-700 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
            Find the perfect plan to match your fitness goals and lifestyle.
          </p>

          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-10 w-10 animate-spin text-[#DFFF00]" />
            </div>
          )}

          {isError && (
            <div className="text-center text-red-500">
              <p>Error loading memberships: {error?.message}</p>
            </div>
          )}

          {!isLoading && !isError && (!memberships || memberships.length === 0) && (
            <div className="text-center text-gray-600 py-10">
              <p className="text-xl font-semibold mb-4">No membership plans available at the moment.</p>
              <p>Please check back later or contact us for more information.</p>
            </div>
          )}

          {!isLoading && !isError && memberships && memberships.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {memberships.map((plan) => (
                <Card key={plan.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                    <p className="text-3xl font-bold text-[#DFFF00] mb-4">
                      ${plan.price.toFixed(2)}{' '}
                      <span className="text-lg text-gray-600">/ {plan.durationMonths} months</span>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
                    Join Now
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Ready to Transform?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join the MultiFit Aundh community today and experience the difference.
          </p>
          <Button className="bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
            Get Started
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipsPage;