import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';


import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from '@radix-ui/react-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
const DialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
const AlertDialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
const AlertDialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

// Mock types to allow the component to be structured, given the actual hooks are missing
// and their return types/arguments are inferred from the feature instruction.
interface ScheduleDto {
  id: string;
  className: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

interface CreateScheduleRequest {
  className: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

interface UpdateScheduleRequest {
  id: string;
  className: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

const AdminSchedulePage: React.FC = () => {
  // Mock data and mutations for structural implementation, as the specified hooks
  // (useAdminSchedule, useCreateScheduleEntry, etc.) are not exported by the provided useSchedule.ts.
  // This allows the component to be built as specified, while highlighting the dependency mismatch.
  const { data: scheduleEntries, isLoading, isError } = {
    data: [
      { id: '1', className: 'Yoga Flow', trainerName: 'Priya Sharma', startTime: '07:00 AM', endTime: '08:00 AM', capacity: 20 },
      { id: '2', className: 'HIIT Blast', trainerName: 'Rajesh Kumar', startTime: '09:00 AM', endTime: '10:00 AM', capacity: 15 },
      { id: '3', className: 'Spin Class', trainerName: 'Anjali Singh', startTime: '06:00 PM', endTime: '07:00 PM', capacity: 18 },
    ] as ScheduleDto[],
    isLoading: false,
    isError: false,
  };

  const createMutation = {
    isPending: false,
    mutate: (data: CreateScheduleRequest) => console.log('Create Schedule:', data),
  };
  const updateMutation = {
    isPending: false,
    mutate: (data: UpdateScheduleRequest) => console.log('Update Schedule:', data),
  };
  const deleteMutation = {
    isPending: false,
    mutate: (id: string) => console.log('Delete Schedule:', id),
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const [formState, setFormState] = useState<CreateScheduleRequest | UpdateScheduleRequest>({
    className: '',
    trainerName: '',
    startTime: '',
    endTime: '',
    capacity: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  };

  const handleAddClick = () => {
    setFormState({ className: '', trainerName: '', startTime: '', endTime: '', capacity: 0 });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (entry: ScheduleDto) => {
    setEditingEntry(entry);
    setFormState({
      id: entry.id,
      className: entry.className,
      trainerName: entry.trainerName,
      startTime: entry.startTime,
      endTime: entry.endTime,
      capacity: entry.capacity,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formState as CreateScheduleRequest);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      updateMutation.mutate(formState as UpdateScheduleRequest);
      setIsEditModalOpen(false);
      setEditingEntry(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingEntryId) {
      deleteMutation.mutate(deletingEntryId);
      setIsDeleteDialogOpen(false);
      setDeletingEntryId(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading schedule...</div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-red-600">Error loading schedule.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Class Schedule</h1>

      <div className="mb-6">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddClick}
              className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200"
            >
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  name="className"
                  value={formState.className}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="trainerName">Trainer Name</Label>
                <Input
                  id="trainerName"
                  name="trainerName"
                  value={formState.trainerName}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formState.startTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formState.endTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formState.capacity}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Adding...' : 'Add Class'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {scheduleEntries && scheduleEntries.length > 0 ? (
        <Table className="bg-white rounded-xl shadow-sm border border-gray-100">
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.className}</TableCell>
                <TableCell>{entry.trainerName}</TableCell>
                <TableCell>{entry.startTime}</TableCell>
                <TableCell>{entry.endTime}</TableCell>
                <TableCell>{entry.capacity}</TableCell>
                <TableCell className="text-right">
                  <Dialog open={isEditModalOpen && editingEntry?.id === entry.id} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(entry)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Edit Class</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="editClassName">Class Name</Label>
                          <Input
                            id="editClassName"
                            name="className"
                            value={formState.className}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editTrainerName">Trainer Name</Label>
                          <Input
                            id="editTrainerName"
                            name="trainerName"
                            value={formState.trainerName}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editStartTime">Start Time</Label>
                          <Input
                            id="editStartTime"
                            name="startTime"
                            type="time"
                            value={formState.startTime}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editEndTime">End Time</Label>
                          <Input
                            id="editEndTime"
                            name="endTime"
                            type="time"
                            value={formState.endTime}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="editCapacity">Capacity</Label>
                          <Input
                            id="editCapacity"
                            name="capacity"
                            type="number"
                            value={formState.capacity}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={isDeleteDialogOpen && deletingEntryId === entry.id} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(entry.id)} className="ml-2">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700">
                          This action cannot be undone. This will permanently delete the class "{entry.className}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-2">No classes scheduled yet.</p>
          <p>Click "Add New Class" to get started!</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSchedulePage;