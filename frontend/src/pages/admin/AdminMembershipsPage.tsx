import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components from shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Radix UI Dialog and AlertDialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@radix-ui/react-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

// Inferred API types and service functions (assuming these are pre-generated ground truth)
import type { MembershipPlanDto, CreateMembershipPlanRequest, UpdateMembershipPlanRequest } from '@/types/membership';
import {
  getAllMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from '@/services/membershipService';

const membershipPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  durationInMonths: z.coerce.number().int().positive("Duration must be a positive integer"),
  isActive: z.boolean(),
});

type MembershipPlanFormValues = z.infer<typeof membershipPlanSchema>;

const AdminMembershipsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlanDto | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationInMonths: 1,
      isActive: true,
    },
  });

  const { data: membershipPlans, isLoading, error } = useQuery({
    queryKey: ['membershipPlans'],
    queryFn: getAllMembershipPlans,
  });

  const createMutation = useMutation({
    mutationFn: createMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      setIsFormDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMembershipPlanRequest }) => updateMembershipPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      setIsFormDialogOpen(false);
      setEditingPlan(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
    },
  });

  const handleCreateOrUpdate = (values: MembershipPlanFormValues) => {
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: { ...values, id: editingPlan.id } });
    } else {
      createMutation.mutate(values);
    }
  };

  const openEditDialog = (plan: MembershipPlanDto) => {
    setEditingPlan(plan);
    setValue('name', plan.name);
    setValue('description', plan.description);
    setValue('price', plan.price);
    setValue('durationInMonths', plan.durationInMonths);
    setValue('isActive', plan.isActive);
    setIsFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingPlan(null);
    reset();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6">Membership Plans</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p>Loading membership plans...</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6">Membership Plans</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 text-red-600">
              <p>Error loading membership plans: {error.message}</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6">Membership Plans</h2>

          <div className="flex justify-end mb-4">
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                  onClick={() => {
                    setEditingPlan(null);
                    reset();
                    setIsFormDialogOpen(true);
                  }}
                >
                  Add New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      {...register('description')}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register('price')}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="durationInMonths">Duration (Months)</Label>
                    <Input
                      id="durationInMonths"
                      type="number"
                      {...register('durationInMonths')}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full"
                    />
                    {errors.durationInMonths && <p className="text-red-500 text-sm mt-1">{errors.durationInMonths.message}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={watch('isActive')}
                      onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
                      className="h-4 w-4 rounded border-gray-300 text-[#DFFF00] focus:ring-[#DFFF00]"
                    />
                    <Label htmlFor="isActive">Is Active</Label>
                  </div>
                  {errors.isActive && <p className="text-red-500 text-sm mt-1">{errors.isActive.message}</p>}

                  <div className="flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                        onClick={closeFormDialog}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {membershipPlans && membershipPlans.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration (Months)</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membershipPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.description}</TableCell>
                        <TableCell>${plan.price.toFixed(2)}</TableCell>
                        <TableCell>{plan.durationInMonths}</TableCell>
                        <TableCell>{plan.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-3 py-1 transition-all duration-200"
                            onClick={() => openEditDialog(plan)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-3 py-1 transition-all duration-200"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the membership plan &quot;{plan.name}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button
                                    className="bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                  >
                                    Cancel
                                  </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                                    onClick={() => deleteMutation.mutate(plan.id)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No membership plans found.</p>
                <p className="text-gray-500">Click &quot;Add New Plan&quot; to create one.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminMembershipsPage;