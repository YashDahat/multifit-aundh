import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import { FaUserSlash, FaEdit, FaSearch, FaInfoCircle } from 'react-icons/fa';

// Mock User type - as no backend contract is provided for admin users
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// Mock API service (since actual API is not available)
const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', roles: ['ADMIN', 'USER'] },
  { id: '2', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', roles: ['USER'] },
  { id: '3', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', roles: ['USER'] },
  { id: '4', email: 'peter.jones@example.com', firstName: 'Peter', lastName: 'Jones', roles: ['USER'] },
  { id: '5', email: 'alice.w@example.com', firstName: 'Alice', lastName: 'Wonder', roles: ['USER'] },
  { id: '6', email: 'bob.t@example.com', firstName: 'Bob', lastName: 'TheBuilder', roles: ['USER'] },
  { id: '7', email: 'charlie.c@example.com', firstName: 'Charlie', lastName: 'Chaplin', roles: ['USER'] },
  { id: '8', email: 'diana.p@example.com', firstName: 'Diana', lastName: 'Prince', roles: ['USER'] },
];

const fetchUsers = async (page: number, limit: number, searchTerm: string): Promise<{ users: User[], total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredUsers = mockUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      resolve({ users: paginatedUsers, total: filteredUsers.length });
    }, 700); // Simulate network delay
  });
};

const deleteUserApi = async (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call success/failure
      if (Math.random() > 0.1) { // 90% success rate
        console.log(`Simulating deletion of user: ${userId}`);
        // In a real app, you'd remove from a global state or refetch
        resolve();
      } else {
        reject(new Error('Failed to delete user. Please try again.'));
      }
    }, 500);
  });
};

const AdminUsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 5;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminUsers', currentPage, searchTerm],
    queryFn: () => fetchUsers(currentPage, usersPerPage, searchTerm),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      refetch(); // Refetch users after successful deletion
      // In a real app, you'd show a toast notification
      alert('User deleted successfully!');
    },
    onError: (err: Error) => {
      // In a real app, you'd show a toast notification
      alert(`Error deleting user: ${err.message}`);
    },
  });

  const totalPages = data ? Math.ceil(data.total / usersPerPage) : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">User Management</h1>

            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-1/2">
                <Input
                  type="text"
                  placeholder="Search users by email, name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {isError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error?.message || 'Failed to load users.'}</span>
              </div>
            )}

            {/* Placeholder message for API not available */}
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2">
              <FaInfoCircle className="text-xl" />
              <span className="block sm:inline">
                User management API is not yet available. Displaying mock data.
              </span>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Loading users...</div>
              ) : data?.users.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FaUserSlash className="mx-auto text-4xl mb-4" />
                  No users found matching your criteria.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                      <TableHead className="text-gray-700 font-semibold">First Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Last Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Roles</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users.map((user) => (
                      <TableRow key={user.id} className="border-b border-gray-200">
                        <TableCell className="py-3 px-4">{user.email}</TableCell>
                        <TableCell className="py-3 px-4">{user.firstName}</TableCell>
                        <TableCell className="py-3 px-4">{user.lastName}</TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge key={role} className={`px-2 py-1 rounded-full text-xs ${role === 'ADMIN' ? 'bg-[#DFFF00] text-[#1A1A1A]' : 'bg-gray-200 text-gray-700'}`}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                              onClick={() => alert(`Edit roles for ${user.email}`)} // Placeholder
                            >
                              <FaEdit className="mr-1" /> Edit Roles
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 transition-all duration-200"
                                  disabled={deleteUserMutation.isPending}
                                >
                                  <FaUserSlash className="mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogPortal>
                                <AlertDialogOverlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                                <AlertDialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                                  <AlertDialogTitle className="text-mauve12 m-0 text-[17px] font-semibold text-gray-900">
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal text-gray-700">
                                    This action cannot be undone. This will permanently delete the user{' '}
                                    <span className="font-semibold">{user.email}</span> and remove their data from our servers.
                                  </AlertDialogDescription>
                                  <div className="flex justify-end gap-[25px]">
                                    <AlertDialogCancel asChild>
                                      <Button
                                        variant="outline"
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                      >
                                        Cancel
                                      </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                      <Button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        Yes, delete user
                                      </Button>
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialogPortal>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination Controls */}
            {data && data.total > usersPerPage && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className={`${
                      currentPage === page
                        ? 'bg-[#DFFF00] text-[#1A1A1A] hover:bg-[#cce600]'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } font-semibold rounded-md px-4 py-2 transition-all duration-200`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                  className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminUsersPage;