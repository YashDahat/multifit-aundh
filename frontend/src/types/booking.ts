// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface BookingRequestDto {
  classScheduleId: string | null;
}

export interface BookingDto {
  id: string | null;
  classScheduleId: string | null;
  userId: string | null;
  bookingDate: string | null;
}

