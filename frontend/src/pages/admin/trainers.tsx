import React, { useState, FormEvent } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTrainers, useCreateTrainer } from '@/hooks/useTrainers';
import * as Dialog from '@radix-ui/react-dialog';
import { CreateTrainerData } from '@/types/trainer';

const AdminTrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();
  const createTrainerMutation = useCreateTrainer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [specializationsInput, setSpecializationsInput] = useState(''); // Comma-separated string
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const specializations = specializationsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const newTrainer: CreateTrainerData = {
      name,
      slug,
      specializations,
      bio,
      imageUrl,
    };

    createTrainerMutation.mutate(newTrainer, {
      onSuccess: () => {
        setIsDialogOpen(false);
        // Clear form fields
        setName('');
        setSlug('');
        setSpecializationsInput('');
        setBio('');
        setImageUrl('');
      },
      onError: (err) => {
        console.error('Failed to create trainer:', err);
        // In a real app, you might display a user-friendly error message here
      }
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
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto">
                  <Dialog.Title className="text-xl font-semibold text-[#1A1A1A] mb-4">Create New Trainer</Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="text-[#333333] font-semibold mb-2 block">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="slug" className="text-[#333333] font-semibold mb-2 block">Slug</label>
                      <input
                        type="text"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="specializations" className="text-[#333333] font-semibold mb-2 block">Specializations (comma-separated)</label>
                      <input
                        type="text"
                        id="specializations"
                        value={specializationsInput}
                        onChange={(e) => setSpecializationsInput(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="bio" className="text-[#333333] font-semibold mb-2 block">Bio</label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="imageUrl" className="text-[#333333] font-semibold mb-2 block">Image URL</label>
                      <input
                        type="url"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 text-[#333333] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md px-4 py-2 transition-all duration-200"
                        disabled={createTrainerMutation.isLoading}
                      >
                        {createTrainerMutation.isLoading ? 'Creating...' : 'Create Trainer'}
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {isError && <p className="text-red-500 mt-4">Failed to load trainers for admin: {error?.message}</p>}

            {isLoading ? (
              <div className="mt-8">
                <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
              </div>
            ) : (
              <div className="overflow-x-auto mt-8">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Specializations
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Image URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainers && trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <tr key={trainer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                            {trainer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                            {trainer.specializations.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                            <a href={trainer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#DFFF00] hover:underline">
                              {trainer.imageUrl.substring(0, 30)}...
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-[#DFFF00] hover:text-[#c2e600] transition-colors duration-200 mr-4">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No trainers found. Click "Add New Trainer" to get started.
                        </td>
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
};

export default AdminTrainersPage;