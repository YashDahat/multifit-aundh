import React, { useState, FormEvent } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTrainers, useCreateTrainer } from '@/hooks/useTrainers';
import * as Dialog from '@radix-ui/react-dialog';
import { CreateTrainerData } from '@/types/trainer';
import clsx from 'clsx';

const AdminTrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();
  const createTrainerMutation = useCreateTrainer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [specializationsInput, setSpecializationsInput] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formMessageType, setFormMessageType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    setFormMessageType(null);

    const specializations = specializationsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const newTrainer: CreateTrainerData = {
      name,
      slug,
      specializations,
      bio,
      imageUrl,
    };

    try {
      await createTrainerMutation.mutateAsync(newTrainer);
      setFormMessage('Trainer created successfully!');
      setFormMessageType('success');
      setName('');
      setSlug('');
      setSpecializationsInput('');
      setBio('');
      setImageUrl('');
      setIsDialogOpen(false); // Close dialog on success
    } catch (err) {
      setFormMessage(`Failed to create trainer: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFormMessageType('error');
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#1A1A1A]">Manage Trainers</h1>
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger asChild>
                  <button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200">
                    Add New Trainer
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black/50 fixed inset-0" />
                  <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-xl font-semibold text-[#1A1A1A] mb-4">Create New Trainer</Dialog.Title>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="text-[#333333] font-semibold mb-2 block">Name</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="slug" className="text-[#333333] font-semibold mb-2 block">Slug</label>
                        <input
                          id="slug"
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="specializations" className="text-[#333333] font-semibold mb-2 block">Specializations (comma-separated)</label>
                        <input
                          id="specializations"
                          type="text"
                          value={specializationsInput}
                          onChange={(e) => setSpecializationsInput(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="bio" className="text-[#333333] font-semibold mb-2 block">Bio</label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="imageUrl" className="text-[#333333] font-semibold mb-2 block">Image URL</label>
                        <input
                          id="imageUrl"
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                          required
                        />
                      </div>
                      {formMessage && (
                        <div className={clsx(
                          "p-3 rounded-md text-sm",
                          formMessageType === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {formMessage}
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-6">
                        <Dialog.Close asChild>
                          <button type="button" className="bg-gray-200 hover:bg-gray-300 text-[#333333] font-semibold rounded-md px-4 py-2 transition-all duration-200">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button
                          type="submit"
                          className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md px-4 py-2 transition-all duration-200"
                          disabled={createTrainerMutation.isPending}
                        >
                          {createTrainerMutation.isPending ? 'Creating...' : 'Create Trainer'}
                        </button>
                      </div>
                    </form>
                    <Dialog.Close asChild>
                      <button
                        className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DFFF00] mx-auto"></div>
                <p className="mt-4 text-[#333333]">Loading trainers...</p>
              </div>
            )}

            {isError && (
              <div className="text-center py-8 text-red-600">
                <p>Failed to load trainers for admin: {error?.message}</p>
              </div>
            )}

            {!isLoading && !isError && trainers && trainers.length > 0 && (
              <div className="overflow-x-auto rounded-lg shadow-md border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specializations</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image URL</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainers.map((trainer) => (
                      <tr key={trainer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{trainer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{trainer.specializations.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                          <a href={trainer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#DFFF00] hover:underline">
                            {trainer.imageUrl.substring(0, 30)}...
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-[#DFFF00] hover:text-[#c2e600] mr-3 transition-all duration-200">Edit</button>
                          <button className="text-red-600 hover:text-red-800 transition-all duration-200">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !isError && trainers && trainers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#333333]">No trainers found. Add a new trainer to get started!</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminTrainersPage;