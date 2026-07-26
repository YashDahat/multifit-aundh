import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import { ClassHighlightsSection } from '@/components/home/ClassHighlightsSection';
import MembershipTiersSection from '@/components/home/MembershipTiersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrialFormSection from '@/components/home/TrialFormSection';
import SocialFeedSection from '@/components/home/SocialFeedSection';
import { useContent } from '@/hooks/useContent';
import { useAllMembershipPlans } from '@/hooks/useMemberships';
import { useWeeklySchedule } from '@/hooks/useSchedule';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const { gymClassesQuery } = useContent();
  const { data: gymClasses, isLoading: isLoadingClasses, isError: isErrorClasses } = gymClassesQuery;
  const { isLoading: isLoadingMemberships, isError: isErrorMemberships } = useAllMembershipPlans();
  const { isLoading: isLoadingTestimonials, isError: isErrorTestimonials } = useContent().testimonialsQuery;
  const { isLoading: isLoadingSchedule, isError: isErrorSchedule } = useWeeklySchedule();

  const isLoading = isLoadingClasses || isLoadingMemberships || isLoadingTestimonials || isLoadingSchedule;
  const isError = isErrorClasses || isErrorMemberships || isErrorTestimonials || isErrorSchedule;

  if (isLoading) {
    return (
      <Layout>
        <HeroSection />
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Our Signature Classes
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12">
              Find your passion, push your limits.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-2xl md:text-3xl font-semibold mb-4">
              Choose Your Path to Fitness
            </h2>
            <p className="text-center text-gray-700 mb-8">
              Flexible plans designed for every goal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
              Hear From Our Community
            </h2>
            <p className="text-center text-gray-700 mb-12">Real stories, real results.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                  <Skeleton className="w-16 h-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-5 rounded-full mr-1" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <TrialFormSection />
        <SocialFeedSection />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <HeroSection />
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center text-red-600">
            Failed to load homepage content. Please try again later.
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection />
      <ClassHighlightsSection gymClasses={gymClasses ?? []} />
      <MembershipTiersSection />
      <TestimonialsSection />
      <TrialFormSection />
      <SocialFeedSection />
    </Layout>
  );
};

export default HomePage;