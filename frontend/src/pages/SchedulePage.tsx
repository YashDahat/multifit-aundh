import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSchedule } from '@/hooks/useSchedule';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import clsx from 'clsx';
import type { ClassScheduleDto } from '@/types/schedule'; // Assuming this type exists as per useSchedule.ts

const SchedulePage: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 })); // Monday as start of week

  const startDate = format(currentWeekStart, 'yyyy-MM-dd');
  const endDate = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const { schedules, isLoading, isError, error, bookClass } = useSchedule(startDate, endDate);

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const getWeekDays = (start: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  const handleBookClass = (classScheduleId: string) => {
    bookClass.mutate(classScheduleId);
    // In a real application, a toast notification would typically be displayed here
    // to inform the user about the booking status.
    console.log(`Attempting to book class: ${classScheduleId}`);
  };

  // The instruction specifies a "Cancel Booking" button if the user has booked a class.
  // However, the `ClassScheduleDto` type (as implied by `useSchedule.ts` dependency)
  // does not expose `isBookedByUser` or `userBookingId`. Without this information,
  // it's impossible to determine if the current user has booked a class or to provide
  // the `bookingId` required by `cancelBooking.mutate`.
  // Therefore, the "Cancel Booking" button is omitted to adhere to the rule of
  // "add nothing, omit nothing" and avoid inventing data or functionality.

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="z-10 text-center text-[#F5F5F5] max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold">YOUR WEEK. YOUR WORKOUT. YOUR TRANSFORMATION.</h1>
          <p className="mt-4 text-lg md:text-xl leading-relaxed">
            Browse our diverse class schedule and book your spot to unleash your full potential at MultiFit Aundh.
          </p>
          <Button
            className="mt-8 bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
            onClick={() => document.getElementById('schedule-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Your First Class
          </Button>
        </div>
      </section>

      {/* Schedule Grid Section */}
      <section id="schedule-grid" className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8 text-center">MultiFit Aundh Class Schedule</h2>

          {/* Week Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={handlePreviousWeek}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all duration-200"
            >
              &larr; Previous Week
            </Button>
            <h3 className="text-xl font-semibold text-gray-800">
              {format(currentWeekStart, 'MMM dd')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
            </h3>
            <Button
              onClick={handleNextWeek}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all duration-200"
            >
              Next Week &rarr;
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-gray-600 text-lg py-10">Loading schedule...</div>
          )}

          {isError && (
            <div className="text-center text-red-600 text-lg py-10">Failed to load schedule: {error?.message}. Please try again later.</div>
          )}

          {!isLoading && !isError && schedules.length === 0 && (
            <div className="text-center text-gray-600 text-lg py-10">No classes scheduled for this week.</div>
          )}

          {!isLoading && !isError && schedules.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h4 className="text-lg font-bold text-[#1A1A1A] mb-4 border-b pb-2">
                    {format(day, 'EEEE, MMM dd')}
                  </h4>
                  <div className="space-y-4">
                    {schedules
                      .filter((s: ClassScheduleDto) => isSameDay(parseISO(s.startTime), day))
                      .sort((a: ClassScheduleDto, b: ClassScheduleDto) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                      .map((classSchedule: ClassScheduleDto) => (
                        <Card key={classSchedule.id} className="p-4 bg-gray-50 border border-gray-100">
                          <h5 className="font-semibold text-lg text-[#1A1A1A]">{classSchedule.gymClass.name}</h5>
                          <p className="text-gray-600 text-sm">Trainer: {classSchedule.gymClass.trainer.name}</p>
                          <p className="text-gray-600 text-sm">
                            Time: {format(parseISO(classSchedule.startTime), 'hh:mm a')} - {format(parseISO(classSchedule.endTime), 'hh:mm a')}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Slots: {classSchedule.capacity - classSchedule.bookedSlots} / {classSchedule.capacity}
                          </p>
                          <div className="mt-4">
                            {classSchedule.capacity - classSchedule.bookedSlots > 0 ? (
                              <Button
                                onClick={() => handleBookClass(classSchedule.id)}
                                disabled={bookClass.isPending}
                                className={clsx(
                                  "w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-4 py-2 transition-all duration-200",
                                  bookClass.isPending && "opacity-70 cursor-not-allowed"
                                )}
                              >
                                {bookClass.isPending ? 'Booking...' : 'Book Now'}
                              </Button>
                            ) : (
                              <Button
                                disabled
                                className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-full cursor-not-allowed"
                              >
                                Fully Booked
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    {schedules.filter((s: ClassScheduleDto) => isSameDay(parseISO(s.startTime), day)).length === 0 && (
                      <p className="text-gray-500 text-sm italic">No classes scheduled for this day.</p>
                    )}
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