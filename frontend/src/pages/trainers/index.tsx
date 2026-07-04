import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';

const TrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError } = useTrainers();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 text-center">
            Our Team
          </h2>

          {isLoading && (
            <div className="text-center text-[#333333]">Loading trainers...</div>
          )}

          {isError && (
            <div className="text-center text-red-600">Failed to load trainers.</div>
          )}

          {!isLoading && !isError && trainers && trainers.length === 0 && (
            <div className="text-center text-[#333333]">No trainers found.</div>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#DFFF00]"
                  />
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mt-4">
                    {trainer.name}
                  </h3>
                  <p className="text-[#333333] text-sm mt-1">
                    {trainer.specializations.join(', ')}
                  </p>
                  <Link href={`/trainers/${trainer.slug}`} className="text-[#DFFF00] hover:underline mt-3 inline-block transition-all duration-200">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;