// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).


export interface CreateGymClassRequest {
  name: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerId: string;
}

export interface GymClassDto {
  id: string | null;
  name: string | null;
  description: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  currentBookings: number | null;
  trainerId: string | null;
  trainerName: string | null;
}

export interface UpdateGymClassRequest {
  name: string | null;
  description: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  trainerId: string | null;
}

export interface ClassBookingDto {
  id: string | null;
  userId: number | null;
  gymClassId: string | null;
  bookingTime: string | null;
  status: unknown | null;
  gymClassName: string | null;
  gymClassDate: string | null;
  gymClassStartTime: string | null;
}

