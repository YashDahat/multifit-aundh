import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTrainer } from '../hooks/useContent';

const TrainerDetailPage: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const { data: trainer, isLoading, isError, error } = useTrainer(trainerId || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5] min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl">Loading trainer details...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5] min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl text-red-500">Error loading trainer details: {error?.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!trainer) {
    return (
      <Layout>
        <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5] min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl">Trainer not found.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="w-64 h-64 rounded-full object-cover border-4 border-[#DFFF00] shadow-lg"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold text-[#DFFF00] mb-2">{trainer.name}</h1>
              <p className="text-xl text-gray-400 mb-4">{trainer.specialization}</p>
              <p className="text-lg leading-relaxed text-[#F5F5F5] mb-6">{trainer.bio}</p>

              {Object.keys(trainer.socialMediaLinks).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-semibold mb-4">Connect with {trainer.name}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {Object.entries(trainer.socialMediaLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#333333] hover:bg-[#DFFF00] text-[#F5F5F5] hover:text-[#1A1A1A] font-semibold py-2 px-4 rounded-full transition-all duration-200 capitalize"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;