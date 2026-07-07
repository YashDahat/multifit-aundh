import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAllTrainers } from '../hooks/useContent';

const TrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useAllTrainers();

  return (
    <Layout>
      <section
        className="relative h-[400px] bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#DFFF00] text-center">
            Meet Our Elite Trainers at MultiFit Aundh
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[#F5F5F5] text-center max-w-2xl mx-auto">
            Our dedicated professionals are here to guide you to your fitness goals with expertise and passion.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#DFFF00] text-center mb-12">
            Our Expert Team
          </h2>

          {isLoading && (
            <div className="text-center text-lg">Loading trainers...</div>
          )}

          {isError && (
            <div className="text-center text-red-500 text-lg">
              Failed to load trainers: {error?.message}
            </div>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5] flex flex-col items-center text-center"
                >
                  <img
                    src={trainer.photoUrl}
                    alt={trainer.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-[#DFFF00]"
                  />
                  <h3 className="text-xl font-semibold text-[#F5F5F5] mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-[#DFFF00] mb-3">
                    {trainer.specialization}
                  </p>
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className="mt-4 inline-block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && (!trainers || trainers.length === 0) && (
            <div className="text-center text-lg text-[#F5F5F5]">
              No trainers found.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;