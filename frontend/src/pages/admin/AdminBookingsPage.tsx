import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from '@radix-ui/react-alert-dialog';
import { Loader2, CalendarX } from 'lucide-react';

// Placeholder Booking type, derived from instruction's display columns
interface Booking {
  id: string;
  userEmail: string;
  className: string;
  scheduleDateTime: string; // ISO 8601 string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

// Placeholder API service functions (simulated)
const fetchAllBookings = async (): Promise<Booking[]> => {
  // As per instruction: "no explicit admin endpoints for fetching all bookings from the
  // `scheduling-api-backend`. The page will display a placeholder message or an empty table
  // until such an API is available."
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  return []; // Return an empty array as per the instruction
};

const cancelBooking = async (bookingId: string): Promise<void> => {
  console.log(`Simulating cancellation for booking ID: ${bookingId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate success
  console.log(`Booking ${bookingId} cancelled successfully.`);
};

const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']): Promise<void> => {
  console.log(`Simulating status update for booking ID: ${bookingId} to ${newStatus}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate success
  console.log(`Booking ${bookingId} status updated to ${newStatus}.`);
};

const AdminBookingsPage: React.FC = () => {
  const { data: bookings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: fetchAllBookings,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      console.log('Booking cancelled successfully!');
      refetch(); // Re-fetch bookings to reflect changes
      // In a real app, a toast notification would be shown here.
    },
    onError: (err) => {
      console.error('Failed to cancel booking:', err.message);
      // In a real app, an error toast notification would be shown here.
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, newStatus }: { bookingId: string; newStatus: Booking['status'] }) => updateBookingStatus(bookingId, newStatus),
    onSuccess: () => {
      console.log('Booking status updated successfully!');
      refetch(); // Re-fetch bookings to reflect changes
      // In a real app, a toast notification would be shown here.
    },
    onError: (err) => {
      console.error('Failed to update booking status:', err.message);
      // In a real app, an error toast notification would be shown here.
    },
  });

  const handleCancelBooking = (bookingId: string) => {
    cancelBookingMutation.mutate(bookingId);
  };

  const handleUpdateStatus = (bookingId: string, currentStatus: Booking['status']) => {
    // Example: Toggle between PENDING and CONFIRMED for demonstration
    const newStatus = currentStatus === 'PENDING' ? 'CONFIRMED' : 'PENDING';
    updateStatusMutation.mutate({ bookingId, newStatus });
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Class Bookings</h1>

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#DFFF00]" />
                <p className="ml-3 text-gray-700">Loading bookings...</p>
              </div>
            )}

            {isError && (
              <div className="text-red-500 text-center py-8">
                <p>Error loading bookings: {error?.message}</p>
              </div>
            )}

            {!isLoading && !isError && (bookings?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-700">
                <CalendarX className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl font-semibold mb-2">No bookings found</p>
                <p className="text-center max-w-md">
                  There are no class bookings to display yet. This section will show all user bookings once the backend API is available.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="text-gray-700 font-semibold">User Email</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Class Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Schedule Date & Time</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((booking) => (
                      <TableRow key={booking.id} className="bg-white border-b border-gray-200">
                        <TableCell>{booking.userEmail}</TableCell>
                        <TableCell>{booking.className}</TableCell>
                        <TableCell>{new Date(booking.scheduleDateTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
                            onClick={() => handleUpdateStatus(booking.id, booking.status)}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update Status
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-3 py-1 text-sm transition-all duration-200"
                                disabled={cancelBookingMutation.isPending}
                              >
                                {cancelBookingMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogPortal>
                              <AlertDialogOverlay className="bg-black/50 fixed inset-0" />
                              <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                                <AlertDialogTitle className="text-lg font-semibold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-gray-500 mt-2">
                                  This action cannot be undone. This will permanently cancel the booking.
                                </AlertDialogDescription>
                                <div className="flex justify-end gap-2 mt-4">
                                  <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 transition-all duration-200">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                  >
                                    Yes, cancel booking
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialogPortal>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminBookingsPage;