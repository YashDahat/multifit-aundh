import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTrainers } from '../hooks/useContent';

const TrainersPage: React.FC = () => {
  const { data: trainers, isLoading, isError, error } = useTrainers();
  const navigate = useNavigate();

  const handleCardClick = (trainerId: string) => {
    navigate(`/trainers/${trainerId}`);
  };

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
            Meet Your Fitness Architects at MultiFit Aundh
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Our expert trainers are here to guide you to your peak performance.
          </p>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Elite Coaching Team</h2>

          {isLoading && (
            <div className="text-center text-xl text-gray-300">Loading trainers...</div>
          )}

          {isError && (
            <div className="text-center text-red-500 text-xl">
              Error fetching trainers: {error?.message || 'Unknown error'}
            </div>
          )}

          {!isLoading && !isError && trainers && trainers.length === 0 && (
            <div className="text-center text-gray-400 text-xl">No trainers found.</div>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 text-[#F5F5F5] cursor-pointer hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick(trainer.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#DFFF00]"
                    />
                    <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                    <p className="text-[#DFFF00] text-lg">{trainer.specialization}</p>
                  </div>
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