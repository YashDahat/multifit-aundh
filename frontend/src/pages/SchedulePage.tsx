import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import { BookingConfirmationDialog } from '@/components/schedule/BookingConfirmationDialog';
import { useWeeklySchedule } from '@/hooks/useSchedule';
import { ClassScheduleDto } from '@/types/schedule';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<ClassScheduleDto | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const { data: weeklySchedule, isLoading, isError, error } = useWeeklySchedule();

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleClassSelect = (classSchedule: ClassScheduleDto) => {
    setSelectedClass(classSchedule);
    setIsBookingDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setIsBookingDialogOpen(false);
    setSelectedClass(null);
  };

  return (
    <Layout>
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
            Weekly Class Schedule
          </h1>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-red-600">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-xl font-semibold">Error loading schedule</p>
              <p className="text-gray-700">{error?.message || 'Please try again later.'}</p>
            </div>
          )}

          {weeklySchedule && !isLoading && !isError && (
            <ScheduleCalendar
              weeklySchedule={weeklySchedule}
              currentDate={currentDate}
              onDateChange={handleDateChange}
              onClassSelect={handleClassSelect}
            />
          )}
        </div>
      </section>

      <BookingConfirmationDialog
        isOpen={isBookingDialogOpen}
        onClose={handleCloseBookingDialog}
        classSchedule={selectedClass}
      />
    </Layout>
  );
};

export default SchedulePage;