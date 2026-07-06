import React from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useMembership } from '../hooks/useMemberships';
import { useSchedule } from '../hooks/useSchedule';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Placeholder for userId as no AuthContext or similar mechanism is provided.
// The useMembership hook in useMemberships.ts is defined as useMembership(id: string)
// and returns MembershipDto (a plan), not a UserMembership object with user-specific details.
// This means fields like startDate, endDate, status, and paymentHistory cannot be displayed
// from the fetched data and will be marked as "N/A" or show an empty state.
const DUMMY_USER_ID = 'member-123';

const MemberDashboardPage: React.FC = () => {
  // Fetch user's membership plan details
  const {
    data: userMembershipPlan,
    isLoading: isMembershipLoading,
    isError: isMembershipError,
    error: membershipError,
  } = useMembership(DUMMY_USER_ID);

  // Fetch upcoming classes for the next 3 months
  const today = new Date();
  const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now
  const endDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD

  const {
    schedules,
    isLoading: isScheduleLoading,
    isError: isScheduleError,
    error: scheduleError,
  } = useSchedule(startDate, endDate);

  // Handle loading states
  if (isMembershipLoading || isScheduleLoading) {
    return (
      <ProtectedRoute allowedRoles={['MEMBER', 'ADMIN']}>
        <Layout>
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">Loading Dashboard...</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6 h-48 animate-pulse bg-gray-200"></Card>
                <Card className="p-6 h-48 animate-pulse bg-gray-200"></Card>
                <Card className="p-6 h-48 animate-pulse bg-gray-200"></Card>
              </div>
            </div>
          </section>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Handle error states
  if (isMembershipError || isScheduleError) {
    return (
      <ProtectedRoute allowedRoles={['MEMBER', 'ADMIN']}>
        <Layout>
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-8">Error loading dashboard.</h1>
              {membershipError && <p className="text-red-500">Membership Error: {membershipError.message}</p>}
              {scheduleError && <p className="text-red-500">Schedule Error: {scheduleError.message}</p>}
            </div>
          </section>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Member Name for Hero section (cannot get actual name from MembershipDto)
  const memberName = 'Member';

  return (
    <ProtectedRoute allowedRoles={['MEMBER', 'ADMIN']}>
      <Layout>
        {/* Hero Section */}
        <section
          className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-[#F5F5F5] max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome Back, {memberName}!</h1>
            <p className="text-lg md:text-xl leading-relaxed">Your fitness journey continues at MultiFit Aundh.</p>
          </div>
        </section>

        {/* Current Membership Section */}
        <section className="py-16 px-4 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Your Current Membership</h2>
            {userMembershipPlan ? (
              <Card className="p-6 max-w-2xl mx-auto text-gray-700">
                <h3 className="text-xl font-bold mb-4">{userMembershipPlan.name}</h3>
                <p className="mb-2"><strong>Price:</strong> ${userMembershipPlan.price.toFixed(2)}</p>
                <p className="mb-2"><strong>Duration:</strong> {userMembershipPlan.durationMonths} months</p>
                {/* These fields are not available from MembershipDto, using placeholders */}
                <p className="mb-2"><strong>Start Date:</strong> N/A (User-specific data not available)</p>
                <p className="mb-2"><strong>End Date:</strong> N/A (User-specific data not available)</p>
                <p className="mb-4"><strong>Status:</strong> N/A (User-specific data not available)</p>
                <Button className="bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
                  Renew Membership
                </Button>
              </Card>
            ) : (
              <div className="text-center text-gray-600 p-8 border border-gray-200 rounded-xl bg-white shadow-sm">
                <p className="text-lg mb-4">You don't seem to have an active membership.</p>
                <Button className="bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
                  View Membership Plans
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Booked Classes Section */}
        <section className="py-16 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Your Upcoming Classes</h2>
            {schedules && schedules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((schedule) => (
                  <Card key={schedule.id} className="p-6 text-gray-700">
                    <h3 className="text-xl font-bold mb-2">{schedule.className}</h3>
                    <p className="mb-1"><strong>Date:</strong> {new Date(schedule.classDate).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                    <p className="mb-1"><strong>Trainer:</strong> {schedule.trainerName}</p>
                    <p className="mb-1"><strong>Location:</strong> {schedule.location}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 p-8 border border-gray-200 rounded-xl bg-white shadow-sm">
                <p className="text-lg mb-4">You have no upcoming classes booked.</p>
                <Button className="bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
                  Browse Classes
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Payment History Section */}
        <section className="py-16 px-4 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Payment History</h2>
            {/* Payment history is not available from MembershipDto */}
            <div className="text-center text-gray-600 p-8 border border-gray-200 rounded-xl bg-white shadow-sm">
              <p className="text-lg mb-4">No payment history available.</p>
              <p className="text-sm">This section requires user-specific payment history data, which is not provided by the current `useMembership` hook's return type (`MembershipDto`).</p>
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default MemberDashboardPage;