import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminMemberships } from '@/hooks/useAdminMemberships';
import { MembershipPlan } from '@/types/membership';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';

// Zod schema for form validation
const membershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Price must be non-negative')
  ),
  durationMonths: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, 'Duration must be at least 1 month')
  ),
  active: z.boolean().default(true),
});

type MembershipPlanFormValues = z.infer<typeof membershipPlanSchema>;

const AdminMembershipsPage: React.FC = () => {
  const {
    getAllMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
  } = useAdminMemberships();

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const form = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationMonths: 1,
      active: true,
    },
  });

  useEffect(() => {
    if (editingPlan) {
      form.reset({
        name: editingPlan.name,
        description: editingPlan.description,
        price: editingPlan.price,
        durationMonths: editingPlan.durationMonths,
        active: editingPlan.active,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        durationMonths: 1,
        active: true,
      });
    }
  }, [editingPlan, form]);

  const handleCreateNewPlanClick = () => {
    setEditingPlan(null);
    setIsCreateEditModalOpen(true);
  };

  const handleEditPlanClick = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsCreateEditModalOpen(true);
  };

  const handleDeletePlanClick = (id: string) => {
    setDeletingPlanId(id);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingPlanId) {
      deleteMembershipPlan.mutate(deletingPlanId, {
        onSuccess: () => {
          setIsDeleteConfirmModalOpen(false);
          setDeletingPlanId(null);
        },
      });
    }
  };

  const onSubmit = (data: MembershipPlanFormValues) => {
    if (editingPlan) {
      updateMembershipPlan.mutate(
        { id: editingPlan.id, plan: data },
        {
          onSuccess: () => {
            setIsCreateEditModalOpen(false);
            setEditingPlan(null);
            form.reset();
          },
        }
      );
    } else {
      createMembershipPlan.mutate(data, {
        onSuccess: () => {
          setIsCreateEditModalOpen(false);
          form.reset();
        },
      });
    }
  };

  const { data: membershipPlans, isLoading, isError, error } = getAllMembershipPlans;

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Membership Plans</h1>

          <div className="mb-6">
            <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreateNewPlanClick}
                  className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-6 py-3 transition-all duration-200"
                >
                  Create New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" {...form.register('name')} className="col-span-3" />
                    {form.formState.errors.name && (
                      <p className="col-start-2 col-span-3 text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" {...form.register('description')} className="col-span-3" />
                    {form.formState.errors.description && (
                      <p className="col-start-2 col-span-3 text-red-500 text-sm">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input id="price" type="number" step="0.01" {...form.register('price')} className="col-span-3" />
                    {form.formState.errors.price && (
                      <p className="col-start-2 col-span-3 text-red-500 text-sm">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="durationMonths" className="text-right">
                      Duration (Months)
                    </Label>
                    <Input id="durationMonths" type="number" {...form.register('durationMonths')} className="col-span-3" />
                    {form.formState.errors.durationMonths && (
                      <p className="col-start-2 col-span-3 text-red-500 text-sm">
                        {form.formState.errors.durationMonths.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="active" className="text-right">
                      Active
                    </Label>
                    <Checkbox.Root
                      id="active"
                      checked={form.watch('active')}
                      onCheckedChange={(checked) => form.setValue('active', checked as boolean)}
                      className="flex h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#DFFF00] data-[state=checked]:text-[#1A1A1A]"
                    >
                      <Checkbox.Indicator className="flex items-center justify-center text-current">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-4 py-2 transition-all duration-200"
                      disabled={createMembershipPlan.isPending || updateMembershipPlan.isPending}
                    >
                      {editingPlan ? 'Save Changes' : 'Create Plan'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading membership plans...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-600">
              <p>Error: {error?.message || 'Failed to fetch membership plans.'}</p>
            </div>
          )}

          {!isLoading && !isError && membershipPlans && membershipPlans.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <p className="text-gray-600">No membership plans found. Create one to get started!</p>
            </div>
          )}

          {!isLoading && !isError && membershipPlans && membershipPlans.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration (Months)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {membershipPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{plan.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.durationMonths}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Checkbox.Root
                          checked={plan.active}
                          disabled
                          className="flex h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#DFFF00] data-[state=checked]:text-[#1A1A1A]"
                        >
                          <Checkbox.Indicator className="flex items-center justify-center text-current">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => handleEditPlanClick(plan)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-all duration-200"
                          variant="ghost"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeletePlanClick(plan.id)}
                          className="text-red-600 hover:text-red-900 transition-all duration-200"
                          variant="ghost"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-700">Are you sure you want to delete this membership plan? This action cannot be undone.</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-4 py-2 transition-all duration-200"
                  disabled={deleteMembershipPlan.isPending}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminMembershipsPage;