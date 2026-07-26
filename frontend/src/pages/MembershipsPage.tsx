import Layout from '@/components/Layout';
import { MembershipPlanCard } from '@/components/membership/MembershipPlanCard';
import { useAllMembershipPlans } from '@/hooks/useMemberships';
import { Skeleton } from '@/components/ui/skeleton';

export default function MembershipsPage() {
  const { data: membershipPlans, isLoading, isError, error } = useAllMembershipPlans();

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Our Membership Plans
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-[350px] w-full rounded-xl" />
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
          <div className="max-w-7xl mx-auto text-center text-red-500">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Error</h1>
            <p>Failed to load membership plans: {error?.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative h-[400px] md:h-[500px] bg-[url('/images/membership-hero.webp')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Choose Your Path to Fitness
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Unlock your potential with our flexible and comprehensive membership plans.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-[#1A1A1A]">
            Our Membership Plans
          </h2>
          {membershipPlans && membershipPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipPlans.map((plan) => (
                <MembershipPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No membership plans available at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}