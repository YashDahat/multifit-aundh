export interface Schedule {
  id: string;
  className: string;
  trainerName: string;
  startTime: string; // ISO 8601 formatted date-time string
  endTime: string; // ISO 8601 formatted date-time string
  capacity: number;
  currentBookings: number;
}

export interface Booking {
  id: string;
  scheduleId: string;
  userId: string;
  bookingTime: string; // ISO 8601 formatted date-time string
}