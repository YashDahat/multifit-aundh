import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="z-10 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5]">
            Meet Our Elite Trainers at MultiFit Aundh
          </h1>
          <p className="text-[#F5F5F5] leading-relaxed mt-4 text-lg">
            Dedicated to empowering your fitness journey with personalized guidance and unwavering support. Get ready to transform!
          </p>
          <Link
            to="/memberships"
            className="bg-[#DFFF00] hover:bg-[#B3CC00] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 mt-8 inline-block"
          >
            Join the MultiFit Family
          </Link>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-12 text-center">
            Our Expert Team
          </h2>

          {isLoading && (
            <p className="text-center text-lg text-gray-400">Loading trainers...</p>
          )}

          {isError && (
            <p className="text-center text-lg text-red-500">Failed to load trainers. Please try again later.</p>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6 text-[#F5F5F5]">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="object-cover w-full h-64 rounded-t-xl"
                  />
                  <h3 className="text-2xl font-semibold mt-4 text-[#DFFF00]">
                    {trainer.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    {trainer.specializations.join(', ')}
                  </p>
                  <p className="text-[#F5F5F5] mt-4">
                    {trainer.bio}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && (!trainers || trainers.length === 0) && (
            <p className="text-center text-lg text-gray-400">No trainers found at the moment.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;