import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';
import Link from 'next/link';
import React from 'react';

const TrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();

  if (isLoading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
        <section className="relative h-[500px] md:h-[600px] bg-gray-800 animate-pulse flex items-center justify-center text-center">
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <div className="h-12 bg-gray-700 rounded w-3/4 mx-auto mb-4" />
            <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto" />
          </div>
        </section>

        {/* Trainers Grid Skeleton */}
        <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto" />
                  <div className="h-6 bg-gray-200 rounded mt-4 w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded mt-3 w-1/3 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        {/* Hero Section Placeholder */}
        <section
          className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5]">
              Meet Our Expert Trainers at MultiFit Aundh
            </h1>
            <p className="text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-2xl mx-auto">
              Dedicated to helping you achieve your fitness goals with personalized guidance and motivation.
            </p>
          </div>
        </section>

        {/* Error Message Section */}
        <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10">Our Team</h2>
            <p className="text-red-500 text-lg">Failed to load trainers: {error?.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5]">
            Meet Our Expert Trainers at MultiFit Aundh
          </h1>
          <p className="text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-2xl mx-auto">
            Dedicated to helping you achieve your fitness goals with personalized guidance and motivation.
          </p>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers?.map((trainer) => (
              <div key={trainer.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#DFFF00]">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mt-4">{trainer.name}</h3>
                <p className="text-[#333333] text-sm mt-1">{trainer.specializations.join(', ')}</p>
                <Link href={`/trainers/${trainer.slug}`} className="text-[#DFFF00] hover:underline mt-3 inline-block transition-all duration-200">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
          {trainers?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No trainers found at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;