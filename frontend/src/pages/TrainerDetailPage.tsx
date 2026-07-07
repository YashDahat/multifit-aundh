import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTrainer } from '../hooks/useContent';

const TrainerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: trainer, isLoading, isError, error } = useTrainer(id || '');

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#DFFF00] text-center">
            {isLoading ? 'Loading Trainer...' : trainer?.name || 'Trainer Details'}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[#F5F5F5] text-center max-w-2xl mx-auto">
            {isLoading ? '...' : trainer?.specialization || 'Specialization'}
          </p>
        </div>
      </section>

      {/* Trainer Detail Section */}
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8">
          {isLoading ? (
            <p>Loading trainer details...</p>
          ) : isError ? (
            <p>Failed to load trainer: {error?.message}</p>
          ) : !trainer ? (
            <p>Trainer not found.</p>
          ) : (
            <>
              {/* Image Column */}
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src={trainer.photoUrl}
                  alt={trainer.name}
                  className="w-full h-auto rounded-xl object-cover border-2 border-[#DFFF00]"
                />
              </div>

              {/* Details Column */}
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-[#DFFF00] mb-4">About {trainer.name}</h2>
                <p className="text-lg leading-relaxed mb-6">{trainer.bio}</p>

                <h3 className="text-2xl font-bold text-[#DFFF00] mb-3">Specialization</h3>
                <p className="text-lg">{trainer.specialization}</p>

                <Link
                  to="/trainers"
                  className="mt-8 inline-block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"
                >
                  Back to Trainers
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;