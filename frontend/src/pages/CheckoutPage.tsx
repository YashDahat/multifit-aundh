import { useParams } from 'react-router-dom';
import { useMembershipPlan } from '@/hooks/useMemberships';
import Layout from '@/components/Layout';
import CheckoutForm from '@/components/membership/CheckoutForm';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: membershipPlan, isLoading, isError } = useMembershipPlan(id || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="w-full max-w-lg space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError || !membershipPlan) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-red-600">Error loading membership plan.</h2>
            <p className="mt-4 text-gray-700">Please try again later or contact support.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <CheckoutForm membershipPlan={membershipPlan} />
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;