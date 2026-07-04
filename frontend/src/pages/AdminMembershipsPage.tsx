import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdminMemberships } from '@/hooks/useAdminMemberships';
import { MembershipPlan } from '@/types/membership';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx } from 'clsx';

const membershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  durationMonths: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  active: z.boolean().default(true),
});

type MembershipPlanFormFields = z.infer<typeof membershipPlanSchema>;

export const AdminMembershipsPage = (): JSX.Element => {
  const {
    getAllMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
  } = useAdminMemberships();

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDeleteId, setPlanToDeleteId] = useState<string | null>(null);

  const form = useForm<MembershipPlanFormFields>({
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

  const handleCreateNewPlan = () => {
    setEditingPlan(null);
    setIsCreateEditModalOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsCreateEditModalOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    setPlanToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlan = () => {
    if (planToDeleteId) {
      deleteMembershipPlan.mutate(planToDeleteId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setPlanToDeleteId(null);
        },
      });
    }
  };

  const onSubmit = (data: MembershipPlanFormFields) => {
    if (editingPlan) {
      updateMembershipPlan.mutate(
        { id: editingPlan.id, plan: data },
        {
          onSuccess: () => {
            setIsCreateEditModalOpen(false);
            setEditingPlan(null);
          },
        }
      );
    } else {
      createMembershipPlan.mutate(data, {
        onSuccess: () => {
          setIsCreateEditModalOpen(false);
        },
      });
    }
  };

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Membership Plans</h1>

          <div className="flex justify-end mb-6">
            <Button
              onClick={handleCreateNewPlan}
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-6 py-3 transition-all duration-200"
            >
              Create New Plan
            </Button>
          </div>

          {getAllMembershipPlans.isLoading && (
            <div className="text-center py-8">Loading membership plans...</div>
          )}

          {getAllMembershipPlans.isError && (
            <div className="text-center py-8 text-red-600">
              Error loading membership plans: {getAllMembershipPlans.error?.message}
            </div>
          )}

          {getAllMembershipPlans.data && getAllMembershipPlans.data.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
                  {getAllMembershipPlans.data.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.description}</TableCell>
                      <TableCell>${plan.price.toFixed(2)}</TableCell>
                      <TableCell>{plan.durationMonths}</TableCell>
                      <TableCell>
                        <Checkbox checked={plan.active} disabled />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                          className="mr-2 transition-all duration-200 hover:bg-gray-100"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="transition-all duration-200 hover:opacity-80"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            !getAllMembershipPlans.isLoading && !getAllMembershipPlans.isError && (
              <div className="text-center py-8 text-gray-600">No membership plans found.</div>
            )
          )}
        </div>
      </section>

      {/* Create/Edit Membership Plan Modal */}
      <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Membership Plan' : 'Create New Plan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                className={clsx('col-span-3', {
                  'border-red-500': form.formState.errors.name,
                })}
              />
              {form.formState.errors.name && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                {...form.register('description')}
                className={clsx('col-span-3', {
                  'border-red-500': form.formState.errors.description,
                })}
              />
              {form.formState.errors.description && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price')}
                className={clsx('col-span-3', {
                  'border-red-500': form.formState.errors.price,
                })}
              />
              {form.formState.errors.price && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="durationMonths" className="text-right">
                Duration (Months)
              </Label>
              <Input
                id="durationMonths"
                type="number"
                {...form.register('durationMonths')}
                className={clsx('col-span-3', {
                  'border-red-500': form.formState.errors.durationMonths,
                })}
              />
              {form.formState.errors.durationMonths && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {form.formState.errors.durationMonths.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Checkbox
                id="active"
                checked={form.watch('active')}
                onCheckedChange={(checked) => form.setValue('active', checked as boolean)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateEditModalOpen(false)}
                className="transition-all duration-200 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold transition-all duration-200"
                disabled={createMembershipPlan.isPending || updateMembershipPlan.isPending}
              >
                {editingPlan ? 'Save Changes' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the membership plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200 hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePlan}
              className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
              disabled={deleteMembershipPlan.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};