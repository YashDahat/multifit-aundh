import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';

const TrainerDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: trainers, isLoading, isError, error } = useTrainers();

  const trainerSlug = typeof slug === 'string' ? slug : undefined;

  const trainer = trainers?.find(t => t.slug === trainerSlug);

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

  if (!trainer) {
    return (
      <Layout>
        <section className="py-16 px-4 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">Trainer not found</h1>
            <p className="mt-4 text-lg text-[#333333]">The trainer you are looking for does not exist.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{trainer.name} - MultiFit Aundh Trainer</title>
        <meta name="description" content={`Meet ${trainer.name}, an expert trainer at MultiFit Aundh specializing in ${trainer.specializations.join(', ')}.`} />
      </Head>

      <section className="py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={trainer.imageUrl}
                alt={trainer.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-6">{trainer.name}</h1>
            <p className="text-xl text-[#DFFF00] mt-2">{trainer.specializations.join(', ')}</p>
            <p className="text-[#333333] leading-relaxed mt-6">{trainer.bio}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;