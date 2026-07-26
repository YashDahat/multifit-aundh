import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAllMembershipPlans, usePurchaseMembership } from '@/hooks/useMemberships';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';

const MembershipTiersSection = () => {
  const { data: membershipPlans, isLoading, isError } = useAllMembershipPlans();
  const { purchaseMembership, isPending: isPurchasing } = usePurchaseMembership();
  const navigate = useNavigate();

  const handlePurchase = (planId: string | null, price: number | null) => {
    if (!planId || price === null) {
      toast.error('Membership plan details are missing.');
      return;
    }
    purchaseMembership({
      amount: price,
      currency: 'INR',
      referenceId: planId,
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-semibold mb-4">
            Choose Your Path to Fitness
          </h2>
          <p className="text-center text-gray-700 mb-8">
            Flexible plans designed for every goal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col justify-between">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <div className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !membershipPlans) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          Failed to load membership plans. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-4">
          Choose Your Path to Fitness
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Flexible plans designed for every goal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {membershipPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name ?? 'Unnamed Plan'}
                </CardTitle>
                <p className="text-3xl font-extrabold text-[#DFFF00] mt-2">
                  {plan.price !== null
                    ? plan.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                    : 'N/A'}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 leading-relaxed">
                  {plan.description ?? 'No description available.'}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  className="w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  onClick={() => handlePurchase(plan.id, plan.price)}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? 'Processing...' : 'Join Now'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  onClick={() => navigate(ROUTES.MEMBERSHIPS)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipTiersSection;