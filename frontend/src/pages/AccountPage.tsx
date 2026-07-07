import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useUserActiveMembership } from '../hooks/useMemberships';

const AccountPage: React.FC = () => {
  const { data: userMembership, isLoading: isMembershipLoading, error: membershipError } = useUserActiveMembership();

  // Placeholder for user's first name as no authentication context is provided
  const userFirstName = "User";

  return (
    <Layout>
      {/* User Dashboard Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5] mb-4">
            Welcome, {userFirstName}!
          </h1>
          <p className="text-gray-300 leading-relaxed text-lg">
            Your MultiFit Aundh Account Overview.
          </p>
        </div>
      </section>

      {/* Current Membership Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Current Membership</h2>
          {isMembershipLoading && <p className="text-gray-300">Loading membership details...</p>}
          {membershipError && <p className="text-red-500">Error loading membership: {membershipError.message}</p>}
          {!isMembershipLoading && !membershipError && (
            userMembership ? (
              <Card className="bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5]">
                <h3 className="text-xl font-semibold mb-2">{ (userMembership as any)?.membershipPlan?.name }</h3>
                <p className="text-gray-300 mb-1">Status: <span className="font-medium text-[#DFFF00]">{ (userMembership as any)?.status }</span></p>
                <p className="text-gray-300 mb-1">Start Date: { (userMembership as any)?.startDate ? format(new Date((userMembership as any).startDate), 'PPP') : 'N/A' }</p>
                <p className="text-gray-300 mb-4">End Date: { (userMembership as any)?.endDate ? format(new Date((userMembership as any).endDate), 'PPP') : 'N/A' }</p>
                <Button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
                  Manage Membership
                </Button>
              </Card>
            ) : (
              <div className="text-center p-8 border border-gray-700 rounded-xl">
                <p className="text-gray-300 mb-4">You don't have an active membership yet.</p>
                <Link to="/memberships">
                  <Button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
                    View Plans
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Your Booked Classes Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Your Booked Classes</h2>
          {/*
            The instruction mentions using `useBookings.useUserBookings()` for this section.
            However, the provided `frontend/src/hooks/useBookings.ts` file does not export `useUserBookings`.
            Therefore, actual booking data cannot be fetched and displayed.
          */}
          <div className="text-center p-8 border border-gray-700 rounded-xl">
            <p className="text-gray-300 mb-4">Booking data is currently unavailable.</p>
            <p className="text-gray-400">Please check back later or contact support.</p>
          </div>
        </div>
      </section>

      {/* Payment History Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Payment History</h2>
          <p className="text-gray-300 leading-relaxed">Your payment history will appear here.</p>
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;