import { useState } from 'react';
import {
  useAllMembershipPlans,
  useDeleteMembershipPlan,
} from '@/hooks/useMemberships';
import { MembershipPlanTable } from '@/components/admin/membership/MembershipPlanTable';
import { MembershipPlanForm } from '@/components/admin/membership/MembershipPlanForm';
import { DeleteConfirmationDialog } from '@/components/admin/common/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { MembershipPlanDto } from '@/types/membership';
import AdminLayout from '@/components/AdminLayout';

export default function AdminMembershipsPage() {
  const { data: membershipPlans, isLoading, isError } = useAllMembershipPlans();
  const deleteMutation = useDeleteMembershipPlan();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlanDto | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDeleteId, setPlanToDeleteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingPlan(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: MembershipPlanDto) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (planId: string) => {
    setPlanToDeleteId(planId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (planToDeleteId) {
      deleteMutation.mutate(planToDeleteId);
      setIsDeleteDialogOpen(false);
      setPlanToDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Membership Plans</h1>
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Membership Plans</h1>
            <p className="text-red-500">Error loading membership plans.</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage Membership Plans</h1>
          <div className="flex justify-end mb-4">
            <Button onClick={handleCreateNew}>Add New Plan</Button>
          </div>

          <MembershipPlanTable
            plans={membershipPlans ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}</DialogTitle>
              </DialogHeader>
              <MembershipPlanForm
                initialData={editingPlan}
                onSuccess={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Confirm Deletion"
            message="Are you sure you want to delete this membership plan? This action cannot be undone."
            onConfirm={confirmDelete}
          />
        </div>
      </section>
    </AdminLayout>
  );
}