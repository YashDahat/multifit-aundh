import React from 'react';
import Layout from '../components/Layout';
import { useTrainers } from '../hooks/useTrainers';

const TrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5]">
            Meet Our Elite Trainers at MultiFit Aundh
          </h1>
          <p className="text-xl text-[#F5F5F5] mt-4">
            Dedicated to empowering your fitness journey with expertise and passion.
          </p>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-12">
            Our Expert Team
          </h2>

          {isLoading && (
            <div className="text-center text-[#333333]">Loading trainers...</div>
          )}

          {isError && (
            <div className="text-center text-red-600">Error: {error?.message || 'Failed to fetch trainers'}</div>
          )}

          {!isLoading && !isError && trainers && trainers.length === 0 && (
            <div className="text-center text-[#333333]">No trainers found.</div>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-[#DFFF00]"
                  />
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{trainer.name}</h3>
                  <p className="text-[#333333] text-sm">{trainer.specialization}</p>
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