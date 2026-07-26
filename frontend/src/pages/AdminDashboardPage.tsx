import AdminLayout from '@/components/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ROUTES } from '@/routes';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
          <p className="text-lg text-gray-700 mb-12">
            Welcome to the MultiFit Aundh Admin Portal. Use the navigation below to manage various aspects of the gym.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={ROUTES.ADMIN_MEMBERSHIPS}>
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Membership Plans</CardTitle>
                  <CardDescription>Manage membership plans, prices, and durations.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to={ROUTES.ADMIN_SCHEDULING}>
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Class Scheduling</CardTitle>
                  <CardDescription>Manage gym classes and their schedules.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to={ROUTES.ADMIN_TRAINERS}>
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Trainers</CardTitle>
                  <CardDescription>Manage trainer profiles and specializations.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to={ROUTES.ADMIN_TESTIMONIALS}>
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Testimonials</CardTitle>
                  <CardDescription>Manage customer testimonials and feedback.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;