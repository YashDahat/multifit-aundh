import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTrainers, useCreateTrainer } from '@/hooks/useTrainers';
import * as Dialog from '@radix-ui/react-dialog';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const AdminTrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();
  const createTrainerMutation = useCreateTrainer();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [specializationsInput, setSpecializationsInput] = useState(''); // Comma-separated string
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specializations = specializationsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    try {
      await createTrainerMutation.mutateAsync({ name, slug, specializations, bio, imageUrl });
      // On success, close the dialog and reset form fields
      setDialogOpen(false);
      setName('');
      setSlug('');
      setSpecializationsInput('');
      setBio('');
      setImageUrl('');
    } catch (err) {
      // Error is handled by react-query, but we can log or show a specific message here if needed
      console.error('Failed to create trainer:', err);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Trainers</h1>

            <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <Button
                  className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 mb-6"
                >
                  Add New Trainer
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto">
                  <Dialog.Title className="text-xl font-semibold text-[#1A1A1A] mb-4">Create New Trainer</Dialog.Title>
                  <Dialog.Description className="text-gray-600 mb-5 text-[15px] leading-normal">
                    Fill in the details for the new trainer.
                  </Dialog.Description>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-[#333333] font-semibold mb-2 block">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug" className="text-[#333333] font-semibold mb-2 block">Slug</Label>
                      <Input
                        id="slug"
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="specializations" className="text-[#333333] font-semibold mb-2 block">Specializations (comma-separated)</Label>
                      <Input
                        id="specializations"
                        type="text"
                        value={specializationsInput}
                        onChange={(e) => setSpecializationsInput(e.target.value)}
                        placeholder="e.g., Strength Training, Yoga, Cardio"
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-[#333333] font-semibold mb-2 block">Bio</Label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={5}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      ></textarea>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl" className="text-[#333333] font-semibold mb-2 block">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                      />
                    </div>

                    {createTrainerMutation.isError && (
                      <p className="text-red-500 text-sm mt-2">Error: {createTrainerMutation.error?.message || 'Failed to create trainer.'}</p>
                    )}
                    {createTrainerMutation.isSuccess && (
                      <p className="text-green-600 text-sm mt-2">Trainer created successfully!</p>
                    )}

                    <div className="mt-6 flex justify-end gap-4">
                      <Dialog.Close asChild>
                        <Button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 transition-all duration-200">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Button
                        type="submit"
                        disabled={createTrainerMutation.isPending}
                        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md px-4 py-2 transition-all duration-200"
                      >
                        {createTrainerMutation.isPending ? 'Creating...' : 'Create Trainer'}
                      </Button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {isLoading && <p className="text-center text-gray-600 mt-8">Loading trainers...</p>}
            {isError && <p className="text-center text-red-500 mt-8">Error: {error?.message || 'Failed to load trainers for admin.'}</p>}

            {!isLoading && !isError && (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</TableHead>
                      <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specializations</TableHead>
                      <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image URL</TableHead>
                      <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainers && trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <TableRow key={trainer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trainer.name}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{trainer.specializations.join(', ')}</TableCell>
                          <TableCell className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">{trainer.imageUrl}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" className="text-[#DFFF00] hover:underline mr-2 transition-all duration-200 p-0 h-auto">Edit</Button>
                            <Button variant="ghost" className="text-red-600 hover:underline transition-all duration-200 p-0 h-auto">Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">No trainers found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminTrainersPage;