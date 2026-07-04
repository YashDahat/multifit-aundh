import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTrainers, useCreateTrainer } from '@/hooks/useTrainers';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreateTrainerData } from '@/types/trainer';

export default function AdminTrainersPage(): JSX.Element {
  const { data: trainers, isLoading, isError, error } = useTrainers();
  const { mutate: createTrainer, isLoading: isCreating, isSuccess: createSuccess, isError: createError } = useCreateTrainer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState<CreateTrainerData>({
    name: '',
    slug: '',
    specializations: [],
    bio: '',
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'specializations') {
      setNewTrainer({ ...newTrainer, [name]: value.split(',').map(s => s.trim()).filter(s => s !== '') });
    } else {
      setNewTrainer({ ...newTrainer, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrainer(newTrainer, {
      onSuccess: () => {
        setNewTrainer({ name: '', slug: '', specializations: [], bio: '', imageUrl: '' });
        setIsDialogOpen(false); // Close dialog on success
      },
    });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Trainers</h1>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 mb-8">
                  Add New Trainer
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <Dialog.Title className="text-xl font-semibold text-[#1A1A1A] mb-4">Create New Trainer</Dialog.Title>
                  <Dialog.Description className="text-[#333333] mb-5 text-[15px] leading-normal">
                    Fill in the details to add a new trainer.
                  </Dialog.Description>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <Label htmlFor="name" className="text-[#333333] font-semibold mb-2 block">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={newTrainer.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="slug" className="text-[#333333] font-semibold mb-2 block">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        type="text"
                        value={newTrainer.slug}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="specializations" className="text-[#333333] font-semibold mb-2 block">Specializations (comma-separated)</Label>
                      <Input
                        id="specializations"
                        name="specializations"
                        type="text"
                        value={newTrainer.specializations.join(', ')}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="bio" className="text-[#333333] font-semibold mb-2 block">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={newTrainer.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <Label htmlFor="imageUrl" className="text-[#333333] font-semibold mb-2 block">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={newTrainer.imageUrl}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Dialog.Close asChild>
                        <Button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 transition-all duration-200">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200"
                        disabled={isCreating}
                      >
                        {isCreating ? 'Creating...' : 'Create Trainer'}
                      </button>
                    </div>
                    {createError && <p className="text-red-500 mt-2">Failed to create trainer.</p>}
                    {createSuccess && <p className="text-green-500 mt-2">Trainer created successfully!</p>}
                  </form>
                  <Dialog.Close asChild>
                    <button
                      className="text-gray-500 hover:bg-gray-100 focus:shadow-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                    >
                      X
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {isLoading && (
              <div className="text-center py-8">
                <p className="text-[#333333]">Loading trainers...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DFFF00] mx-auto mt-4"></div>
              </div>
            )}

            {isError && (
              <div className="text-center py-8 text-red-500">
                <p>Failed to load trainers for admin: {error?.message}</p>
              </div>
            )}

            {!isLoading && !isError && (
              <div className="overflow-x-auto rounded-lg shadow-md border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">Name</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specializations</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image URL</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainers && trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <tr key={trainer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">{trainer.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{trainer.specializations.join(', ')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                            <a href={trainer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#DFFF00] hover:underline">
                              {trainer.imageUrl.substring(0, 30)}...
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#DFFF00] hover:text-[#c2e600] transition-all duration-200 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-800 transition-all duration-200">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No trainers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}