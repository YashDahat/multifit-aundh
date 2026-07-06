import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@radix-ui/react-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { useToast } from '@/components/ui/use-toast';
import { membershipService } from '@/services/membershipService';
import { MembershipDto, MembershipType } from '@/types/membership'; // Assuming these types exist

// Zod schema for form validation
const membershipFormSchema = z.object({
  id: z.string().optional(), // For editing existing memberships
  name: z.string().min(1, 'Membership name is required'),
  description: z.string().optional(),
  price: z.coerce.string() // Use coerce to handle string input from HTML
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Invalid price format. Must be a positive number with up to 2 decimal places.')
    .transform(Number)
    .refine(val => val > 0, 'Price must be positive'),
  membershipType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY'], {
    required_error: 'Membership type is required',
  }),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

const AdminMembershipsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<MembershipDto | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
  });

  // Fetch all memberships
  const { data: memberships, isLoading, isError, error } = useQuery({
    queryKey: ['memberships'],
    queryFn: membershipService.getMemberships,
  });

  // Create membership mutation
  const createMembershipMutation = useMutation({
    mutationFn: membershipService.createMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success!',
        description: 'Membership created successfully.',
        variant: 'default',
      });
      setIsModalOpen(false);
      reset();
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to create membership: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update membership mutation
  const updateMembershipMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<MembershipDto, 'id'> }) =>
      membershipService.updateMembership(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success!',
        description: 'Membership updated successfully.',
        variant: 'default',
      });
      setIsModalOpen(false);
      setEditingMembership(null);
      reset();
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to update membership: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete membership mutation
  const deleteMembershipMutation = useMutation({
    mutationFn: membershipService.deleteMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success!',
        description: 'Membership deleted successfully.',
        variant: 'default',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to delete membership: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleCreateNewMembership = () => {
    setEditingMembership(null);
    reset({
      id: undefined,
      name: '',
      description: '',
      price: '',
      membershipType: undefined,
    });
    setIsModalOpen(true);
  };

  const handleEditMembership = (membership: MembershipDto) => {
    setEditingMembership(membership);
    reset({
      id: membership.id,
      name: membership.name,
      description: membership.description || '',
      price: membership.price.toString(), // Convert number to string for input field
      membershipType: membership.membershipType,
    });
    setValue('membershipType', membership.membershipType); // Manually set for Select component
    setIsModalOpen(true);
  };

  const onSubmit = (data: MembershipFormValues) => {
    if (editingMembership) {
      // Update existing membership
      updateMembershipMutation.mutate({
        id: editingMembership.id,
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          membershipType: data.membershipType,
        },
      });
    } else {
      // Create new membership
      createMembershipMutation.mutate({
        name: data.name,
        description: data.description,
        price: data.price,
        membershipType: data.membershipType,
      });
    }
  };

  if (isError) {
    return (
      <AdminLayout>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Memberships</h1>
              <p className="text-red-500">Error loading memberships: {error?.message}</p>
            </div>
          </section>
        </ProtectedRoute>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Memberships</h1>

            <div className="flex justify-end mb-6">
              <Button
                onClick={handleCreateNewMembership}
                className="bg-[#DFFF00] hover:bg-[#cce600] text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
              >
                Create New Membership
              </Button>
            </div>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
              </div>
            ) : memberships && memberships.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Description</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.map((membership) => (
                      <TableRow key={membership.id} className="border-b border-gray-200">
                        <TableCell className="py-3 px-4">{membership.name}</TableCell>
                        <TableCell className="py-3 px-4">{membership.description || '-'}</TableCell>
                        <TableCell className="py-3 px-4">${membership.price.toFixed(2)}</TableCell>
                        <TableCell className="py-3 px-4">
                          <Badge className="bg-[#DFFF00] text-[#1A1A1A]">{membership.membershipType}</Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <Button
                            onClick={() => handleEditMembership(membership)}
                            className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-3 py-1 mr-2 transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-3 py-1 transition-all duration-200">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                membership plan &quot;{membership.name}&quot;.
                              </AlertDialogDescription>
                              <div className="flex justify-end gap-2 mt-4">
                                <AlertDialogCancel asChild>
                                  <Button className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200">
                                    Cancel
                                  </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    onClick={() => deleteMembershipMutation.mutate(membership.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                    disabled={deleteMembershipMutation.isPending}
                                  >
                                    {deleteMembershipMutation.isPending ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 bg-white shadow-md rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No memberships found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new membership plan.
                </p>
              </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-gray-800">
                    {editingMembership ? 'Edit Membership' : 'Create New Membership'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="col-span-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.name && <p className="col-span-4 text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      {...register('description')}
                      className="col-span-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.description && <p className="col-span-4 text-red-500 text-sm">{errors.description.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="text" // Use text for regex validation, transform to number later
                      {...register('price')}
                      className="col-span-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                    />
                    {errors.price && <p className="col-span-4 text-red-500 text-sm">{errors.price.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="membershipType" className="text-right">
                      Type
                    </Label>
                    <Select
                      onValueChange={(value: MembershipType) => setValue('membershipType', value)}
                      value={editingMembership?.membershipType || ''} // Set initial value for Select
                    >
                      <SelectTrigger className="col-span-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent">
                        <SelectValue placeholder="Select a membership type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.membershipType && <p className="col-span-4 text-red-500 text-sm">{errors.membershipType.message}</p>}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-[#DFFF00] hover:bg-[#cce600] text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      disabled={createMembershipMutation.isPending || updateMembershipMutation.isPending}
                    >
                      {editingMembership
                        ? updateMembershipMutation.isPending ? 'Saving...' : 'Save Changes'
                        : createMembershipMutation.isPending ? 'Creating...' : 'Create Membership'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </ProtectedRoute>
    </AdminLayout>
  );
};

export default AdminMembershipsPage;