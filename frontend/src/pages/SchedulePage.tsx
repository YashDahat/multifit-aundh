import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useWeeklyGymClasses,
  useUserBookings,
} from '@/hooks/useGymClasses';
import { useCancelBooking } from '@/hooks/useBookings';
import type { GymClassDto, ClassBookingDto } from '@/types/gymClass';
import clsx from 'clsx';

// Placeholder for useAuth hook as it's not provided in dependencies.
// In a real application, this would be imported from an authentication context/hook
// (e.g., from '@/hooks/useAuth' or similar).
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Simulate a logged-in user if a token exists.
    // In a real app, this would involve decoding the token or fetching user profile.
    if (token) {
      setIsAuthenticated(true);
      // Assign a dummy user ID for booking logic demonstration.
      // The actual user ID type should match ClassBookingDto.userId (number | null).
      setUser({ id: 123, email: 'user@example.com' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return { isAuthenticated, user };
};

const SchedulePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    data: weeklyClasses,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
    error: classesError,
  } = useWeeklyGymClasses();
  const {
    data: userBookings,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    error: bookingsError,
  } = useUserBookings();

  const cancelBookingMutation = useCancelBooking();

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  // Placeholder for book class mutation as useBookClass is not provided in dependencies.
  // The instruction mentions `useBookClass().mutate(classId)` but the hook is absent.
  const handleBookClass = (classId: string) => {
    console.log(`Attempting to book class with ID: ${classId}`);
    alert('Booking functionality is not yet implemented. (useBookClass hook is missing)');
    // In a real application, you would call a mutation hook here:
    // bookClassMutation.mutate(classId);
  };

  const isLoading = isLoadingClasses || isLoadingBookings;
  const isError = isErrorClasses || isErrorBookings;
  const error = classesError || bookingsError;

  const groupedClasses: { [key: string]: GymClassDto[] } = {};
  if (weeklyClasses) {
    weeklyClasses.forEach((cls) => {
      if (cls.date) {
        if (!groupedClasses[cls.date]) {
          groupedClasses[cls.date] = [];
        }
        groupedClasses[cls.date].push(cls);
      }
    });
    // Sort classes within each day by start time
    Object.keys(groupedClasses).forEach(date => {
      groupedClasses[date].sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.localeCompare(b.startTime);
      });
    });
  }

  const sortedDates = Object.keys(groupedClasses).sort();

  const getBookingStatus = (classId: string | null): { isBooked: boolean; bookingId: string | null } => {
    if (!isAuthenticated || !user || !userBookings || !classId) {
      return { isBooked: false, bookingId: null };
    }
    const booking = userBookings.find(
      (b) => b.gymClassId === classId && b.userId === user.id
    );
    return { isBooked: !!booking, bookingId: booking?.id ?? null };
  };

  const renderClassCard = (cls: GymClassDto) => {
    const { isBooked, bookingId } = getBookingStatus(cls.id);
    const isFull = (cls.currentBookings ?? 0) >= (cls.capacity ?? 0);

    return (
      <Card key={cls.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between h-full">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl font-semibold">{cls.name}</CardTitle>
          <p className="text-gray-600 text-sm">{cls.description}</p>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Time:</span> {cls.startTime} - {cls.endTime}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Trainer:</span> {cls.trainerName ?? 'N/A'}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Bookings:</span> {cls.currentBookings ?? 0} / {cls.capacity ?? 0}
          </p>
          <div className="flex items-center gap-2 mb-4">
            {isFull && <Badge variant="destructive">Full</Badge>}
            {isBooked && <Badge className="bg-[#DFFF00] text-[#1A1A1A] hover:bg-[#B3CC00]">Booked</Badge>}
          </div>
        </CardContent>
        {isAuthenticated && (
          <div className="mt-auto">
            {isBooked ? (
              <Button
                onClick={() => bookingId && handleCancelBooking(bookingId)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                disabled={cancelBookingMutation.isPending}
              >
                {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            ) : (
              <Button
                onClick={() => cls.id && handleBookClass(cls.id)}
                className="w-full bg-[#DFFF00] hover:bg-[#B3CC00] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
                disabled={isFull}
              >
                Book Now
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Unleash Your Potential at MultiFit Aundh!
          </h1>
          <p className="mt-4 text-xl text-white">
            Join our high-energy classes and transform your fitness journey.
          </p>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">
            Our Dynamic Class Schedule
          </h2>

          {isLoading && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Loading schedule...</p>
              {/* A more sophisticated loading spinner or skeleton could be added here */}
            </div>
          )}

          {isError && (
            <div className="text-center py-10 text-red-600">
              <p className="text-lg">Error loading schedule: {error?.message}</p>
            </div>
          )}

          {!isLoading && !isError && sortedDates.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              <p className="text-lg">No classes scheduled for this week.</p>
            </div>
          )}

          {!isLoading && !isError && sortedDates.length > 0 && (
            <div className="space-y-12">
              {sortedDates.map((date) => (
                <div key={date}>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedClasses[date].map(renderClassCard)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SchedulePage;