// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface ClassScheduleDto {
  id: string | null;
  gymClassId: string | null;
  gymClassName: string | null;
  trainerName: string | null;
  scheduleDate: string | null;
  startTime: string | null;
  endTime: string | null;
  maxCapacity: number | null;
  currentBookings: number | null;
}

