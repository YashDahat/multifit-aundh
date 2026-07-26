import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/routes';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurchaseSuccessPage = () => {
  return (
    <Layout>
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md text-center p-8 shadow-lg">
            <CardHeader className="flex flex-col items-center">
              <CheckCircle className="h-20 w-20 text-[#DFFF00] mb-4" />
              <CardTitle className="text-3xl font-bold text-gray-900">Purchase Successful!</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Thank you for your membership purchase. You're all set to begin your fitness journey with MultiFit Aundh!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div className="text-left text-gray-700">
                <p className="font-semibold text-lg mb-2">What's next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>You will receive a confirmation email shortly.</li>
                  <li>Your membership details are now active in your profile.</li>
                  <li>Explore our class schedule and book your first session!</li>
                </ul>
              </div>
              <div className="flex flex-col space-y-4">
                <Button asChild className="w-full bg-[#DFFF00] hover:bg-opacity-90 text-[#1A1A1A] font-semibold py-3 rounded-full transition-all duration-200">
                  <Link to={ROUTES.SCHEDULE}>View Class Schedule</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-[#333333] text-[#333333] hover:bg-gray-100 font-semibold py-3 rounded-full transition-all duration-200">
                  <Link to={ROUTES.HOME}>Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default PurchaseSuccessPage;