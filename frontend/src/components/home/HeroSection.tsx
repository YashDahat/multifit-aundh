import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';

const HeroSection = () => {
  return (
    <section
      className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Potential at MultiFit Aundh</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          The antidote to boring gyms. Join our vibrant community and transform your fitness journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="#trial-form">
            <Button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
              Start Your Free Trial
            </Button>
          </Link>
          <Link to={ROUTES.MEMBERSHIPS}>
            <Button variant="outline" className="border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">
              Explore Memberships
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;