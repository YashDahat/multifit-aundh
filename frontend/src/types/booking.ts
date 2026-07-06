// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface BookingDto {
  id: string | null;
  userId: string | null;
  userName: string | null;
  classScheduleId: string | null;
  className: string | null;
  scheduleDate: string | null;
  startTime: string | null;
  bookingTime: string | null;
  status: BookingStatus | null;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

