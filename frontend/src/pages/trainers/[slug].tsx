import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';

const TrainerDetailPage = (): JSX.Element => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: trainers, isLoading, isError, error } = useTrainers();

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-[#333333]">Loading trainer details...</p>
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
            <p className="text-lg text-red-600">Failed to load trainer details: {error?.message}</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">Trainer not found</h1>
            <p className="text-lg text-[#333333] mt-4">The trainer you are looking for does not exist.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 w-64 h-64 relative rounded-full overflow-hidden shadow-lg border-4 border-[#DFFF00]">
              <Image
                src={trainer.imageUrl}
                alt={trainer.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-6 md:mt-0">
                {trainer.name}
              </h1>
              <p className="text-xl text-[#DFFF00] mt-2">
                {trainer.specializations.join(', ')}
              </p>
              <p className="text-[#333333] leading-relaxed mt-6">
                {trainer.bio}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;