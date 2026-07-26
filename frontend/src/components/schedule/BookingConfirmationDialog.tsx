import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClassScheduleDto } from '@/types/schedule';
import { useBookClass } from '@/hooks/useSchedule';
import { format } from 'date-fns';

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classSchedule: ClassScheduleDto | null;
}

export function BookingConfirmationDialog({
  isOpen,
  onClose,
  classSchedule,
}: BookingConfirmationDialogProps) {
  const { mutateAsync: bookClass, isPending } = useBookClass();

  const handleConfirmBooking = async () => {
    if (classSchedule?.id) {
      await bookClass(classSchedule.id);
      onClose();
    }
  };

  if (!classSchedule) {
    return null;
  }

  const formattedDate = classSchedule.scheduleDate
    ? format(new Date(classSchedule.scheduleDate), 'PPP')
    : 'N/A';
  const formattedTime =
    classSchedule.startTime && classSchedule.endTime
      ? `${classSchedule.startTime} - ${classSchedule.endTime}`
      : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Class Booking</DialogTitle>
          <DialogDescription>
            Please review the details below before confirming your booking.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <p>
            <strong>Class:</strong> {classSchedule.gymClassName ?? 'N/A'}
          </p>
          <p>
            <strong>Trainer:</strong> {classSchedule.trainerName ?? 'N/A'}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {formattedTime}
          </p>
          <p>
            <strong>Capacity:</strong> {classSchedule.currentBookings ?? 0} /{' '}
            {classSchedule.maxCapacity ?? 'N/A'}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirmBooking} disabled={isPending}>
            {isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}