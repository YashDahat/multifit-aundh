import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ClassScheduleDto } from '@/types/schedule';
import { PencilIcon, Trash2Icon } from 'lucide-react';

interface ClassScheduleTableProps {
  schedules: ClassScheduleDto[];
  onEdit: (schedule: ClassScheduleDto) => void;
  onDelete: (scheduleId: string) => void;
}

export function ClassScheduleTable({ schedules, onEdit, onDelete }: ClassScheduleTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No class schedules found.
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{schedule.gymClassName}</TableCell>
                <TableCell>{schedule.trainerName}</TableCell>
                <TableCell>{schedule.scheduleDate}</TableCell>
                <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                <TableCell>{schedule.maxCapacity}</TableCell>
                <TableCell>{schedule.currentBookings}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(schedule)}
                    className="mr-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => schedule.id && onDelete(schedule.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}