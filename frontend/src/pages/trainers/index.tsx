import Layout from '@/components/Layout';
import { useTrainers } from '@/hooks/useTrainers';
import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaExclamationCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const TrainersPage = (): JSX.Element => {
  const { data: trainers, isLoading, isError, error } = useTrainers();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-[#F5F5F5] px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Meet Our Expert Trainers at MultiFit Aundh</h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto">
            Dedicated to helping you achieve your fitness goals with personalized guidance and motivation.
          </p>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="py-16 px-4 md:py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 text-center">Our Team</h2>

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <ImSpinner2 className="animate-spin text-[#DFFF00] text-5xl" />
            </div>
          )}

          {isError && (
            <div className="text-center py-10">
              <FaExclamationCircle className="mx-auto text-red-500 text-5xl mb-4" />
              <p className="text-lg text-red-700">Failed to load trainers. {error?.message}</p>
            </div>
          )}

          {!isLoading && !isError && (!trainers || trainers.length === 0) && (
            <div className="text-center py-10">
              <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-lg text-gray-600">No trainers found at the moment. Please check back later!</p>
            </div>
          )}

          {!isLoading && !isError && trainers && trainers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg"
                >
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#DFFF00]">
                    <Image
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mt-4">{trainer.name}</h3>
                  <p className="text-[#333333] text-sm mt-1">{trainer.specializations.join(', ')}</p>
                  <Link
                    href={`/trainers/${trainer.slug}`}
                    className="text-[#DFFF00] hover:underline mt-3 inline-block transition-all duration-200"
                  >
                    View Profile &rarr;
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