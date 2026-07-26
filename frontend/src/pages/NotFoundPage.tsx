import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <Layout>
      <section className="py-16 px-4 bg-gray-50 min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-[#1A1A1A] mb-4">404</h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <Button asChild className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
            <Link to={ROUTES.HOME}>Go to Homepage</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;