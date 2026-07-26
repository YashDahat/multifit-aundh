import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MembershipPlanDto } from '@/types/membership';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

interface MembershipPlanCardProps {
  plan: MembershipPlanDto;
}

export function MembershipPlanCard({ plan }: MembershipPlanCardProps) {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    if (plan.id) {
      navigate(`${ROUTES.CHECKOUT}?planId=${plan.id}`);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-gray-600">
          {plan.durationInMonths} Month Plan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-4xl font-extrabold text-[#DFFF00] mb-4">
          {plan.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </p>
        <p className="text-gray-700 leading-relaxed">{plan.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleJoinNow}
          className="w-full bg-[#DFFF00] hover:bg-opacity-90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
        >
          Join Now
        </Button>
      </CardFooter>
    </Card>
  );
}