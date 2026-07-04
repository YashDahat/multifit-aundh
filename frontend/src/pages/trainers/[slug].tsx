import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';
import { Spinner } from '@/components/ui/spinner';

const TrainerDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: trainers, isLoading, isError, error } = useTrainers();

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#333333]">Loading trainer details...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-red-500">Failed to load trainer details: {error?.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  const trainer = trainers?.find((t) => t.slug === slug);

  if (!trainer) {
    return (
      <Layout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Trainer not found</h1>
            <p className="mt-4 text-[#333333]">The trainer you are looking for does not exist.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {trainer.imageUrl && (
              <div className="relative w-full max-w-2xl h-96 rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={trainer.imageUrl}
                  alt={trainer.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-6 text-center">
              {trainer.name}
            </h1>
            {trainer.specializations && trainer.specializations.length > 0 && (
              <p className="text-xl text-[#DFFF00] mt-2 text-center">
                {trainer.specializations.join(', ')}
              </p>
            )}
            <p className="text-[#333333] leading-relaxed mt-6 max-w-3xl text-center">
              {trainer.bio}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;