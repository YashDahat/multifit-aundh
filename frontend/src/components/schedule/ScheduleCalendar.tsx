import React from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ClassScheduleDto } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ScheduleCalendarProps {
  weeklySchedule: ClassScheduleDto[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onClassSelect: (classSchedule: ClassScheduleDto) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  weeklySchedule,
  currentDate,
  onDateChange,
  onClassSelect,
}) => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday as start of week
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const classesByDay: { [key: string]: ClassScheduleDto[] } = weeklySchedule.reduce((acc, classSchedule) => {
    const scheduleDate = classSchedule.scheduleDate ? parseISO(classSchedule.scheduleDate) : null;
    if (scheduleDate) {
      const formattedDate = format(scheduleDate, 'yyyy-MM-dd');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(classSchedule);
    }
    return acc;
  }, {} as { [key: string]: ClassScheduleDto[] });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => onDateChange(addDays(currentDate, -7))} variant="outline">
          Previous Week
        </Button>
        <h2 className="text-2xl font-semibold">
          {format(startOfCurrentWeek, 'MMM dd')} - {format(addDays(startOfCurrentWeek, 6), 'MMM dd, yyyy')}
        </h2>
        <Button onClick={() => onDateChange(addDays(currentDate, 7))} variant="outline">
          Next Week
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysOfWeek.map((day) => (
          <Card key={format(day, 'yyyy-MM-dd')} className="flex flex-col">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-medium">
                {format(day, 'EEE, MMM dd')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-3">
              {classesByDay[format(day, 'yyyy-MM-dd')] && classesByDay[format(day, 'yyyy-MM-dd')].length > 0 ? (
                classesByDay[format(day, 'yyyy-MM-dd')]
                  .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''))
                  .map((classSchedule) => (
                    <div key={classSchedule.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{classSchedule.gymClassName}</p>
                          <p className="text-sm text-gray-600">
                            {classSchedule.startTime} - {classSchedule.endTime} with {classSchedule.trainerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Booked: {classSchedule.currentBookings ?? 0} / {classSchedule.maxCapacity ?? 0}
                          </p>
                        </div>
                        <Button
                          onClick={() => onClassSelect(classSchedule)}
                          disabled={(classSchedule.currentBookings ?? 0) >= (classSchedule.maxCapacity ?? 0)}
                          className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-4 py-2 transition-all duration-200 text-sm"
                        >
                          Book
                        </Button>
                      </div>
                      <Separator />
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">No classes scheduled</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;