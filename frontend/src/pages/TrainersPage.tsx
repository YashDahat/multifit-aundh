import Layout from '@/components/Layout';
import { useContent } from '@/hooks/useContent';
import { TrainerGrid } from '@/components/trainers/TrainerGrid';
import { Skeleton } from '@/components/ui/skeleton';

const TrainersPage: React.FC = () => {
  const { trainersQuery } = useContent();
  const { data: trainers, isLoading, isError, error } = trainersQuery;

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
              Meet Our Expert Trainers
            </h1>
            <p className="text-xl text-gray-600 mb-12 text-center">
              Dedicated to your fitness journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-64 w-full rounded-xl" />
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
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-red-600">Error loading trainers</h2>
            <p className="text-gray-700">
              There was an error fetching trainer data: {error?.message || 'Unknown error'}
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
            Meet Our Expert Trainers
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Dedicated to your fitness journey.
          </p>
          {trainers && trainers.length > 0 ? (
            <TrainerGrid trainers={trainers} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-700 text-lg">No trainers found at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;