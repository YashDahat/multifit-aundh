import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import { useSchedule, useCreateBooking } from '../hooks/useSchedule';
import { format } from 'date-fns';

const SchedulePage: React.FC = () => {
  const { data: schedule, isLoading, isError, error } = useSchedule();
  const { mutate, isPending: isBooking } = useCreateBooking();

  const scheduleSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSchedule = () => {
    scheduleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#DFFF00] mb-4">
            Unleash Your Potential at MultiFit Aundh
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F5F5] mb-8">
            Explore our dynamic class schedule and book your next challenge.
          </p>
          <button
            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            onClick={scrollToSchedule}
          >
            Book a Class Now
          </button>
        </div>
      </section>

      {/* Schedule Overview Section */}
      <section ref={scheduleSectionRef} className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#DFFF00] mb-8 text-center">
            Our High-Energy Class Schedule
          </h2>
          <p className="text-lg text-[#F5F5F5] mb-12 text-center max-w-3xl mx-auto">
            Find your perfect workout and join our vibrant community.
          </p>

          {isLoading && (
            <div className="text-center text-[#F5F5F5] text-xl">Loading schedule...</div>
          )}

          {isError && (
            <div className="text-center text-red-500 text-xl">Error loading schedule: {error?.message}</div>
          )}

          {schedule && schedule.length === 0 && !isLoading && (
            <div className="text-center text-[#F5F5F5] text-xl p-8 bg-[#333333] rounded-xl shadow-lg border border-gray-700">
              <p className="mb-4">No classes scheduled at the moment. Check back soon!</p>
              <svg className="mx-auto h-12 w-12 text-[#DFFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {schedule && schedule.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {schedule.map((classItem) => (
                <div key={classItem.id} className="bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#DFFF00] mb-2">{classItem.className}</h3>
                    <p className="text-[#F5F5F5] text-lg mb-1">Trainer: {classItem.trainerName}</p>
                    <p className="text-[#F5F5F5] text-lg mb-1">
                      Time: {format(new Date(classItem.startTime), 'p')} - {format(new Date(classItem.endTime), 'p')}
                    </p>
                    <p className="text-[#F5F5F5] text-lg mb-4">
                      Slots: {classItem.currentBookings}/{classItem.capacity}
                    </p>
                  </div>
                  <button
                    className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => mutate(classItem.id)}
                    disabled={isBooking || classItem.currentBookings >= classItem.capacity}
                  >
                    {isBooking ? 'Booking...' : classItem.currentBookings >= classItem.capacity ? 'Full' : 'Book Now'}
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

export default SchedulePage;