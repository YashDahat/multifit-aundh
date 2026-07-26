import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { getAllTrainers } from '@/services/trainerService';
import { Skeleton } from '@/components/ui/skeleton';

const TrainerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: trainers, isLoading, isError } = useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  });
  const trainer = trainers?.find((t) => t.id === id);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="w-full md:w-1/3 h-96 rounded-lg" />
              <div className="w-full md:w-2/3 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError || !trainer) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-red-600">Error loading trainer details.</h2>
            <p className="text-gray-700">Please try again later or contact support.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-1/3">
              {trainer.imageUrl ? (
                <img
                  src={trainer.imageUrl}
                  alt={trainer.name ?? 'Trainer'}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {trainer.name ?? 'Unknown Trainer'}
              </h1>
              <p className="text-xl text-[#DFFF00] font-semibold">
                {trainer.specialization ?? 'General Fitness'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {trainer.bio ?? 'No biography available for this trainer.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrainerDetailPage;