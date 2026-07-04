import Layout from '@/components/Layout';
import Link from 'next/link';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrialForm from '@/components/TrialForm';

const HomePage: React.FC = () => {
  const classHighlights = [
    {
      title: 'High-Intensity Interval Training (HIIT)',
      description: 'Maximize calorie burn and boost your metabolism with our dynamic HIIT sessions. Push your limits and see real results.',
      image: 'https://images.unsplash.com/photo-1594381837177-385002773950?w=800&q=80',
    },
    {
      title: 'Yoga & Flexibility',
      description: 'Improve your strength, balance, and mental well-being with our diverse yoga classes. Suitable for all levels.',
      image: 'https://images.unsplash.com/photo-1544367664-90a887a1770b?w=800&q=80',
    },
    {
      title: 'Strength & Conditioning',
      description: 'Build muscle, increase endurance, and sculpt your body with our expert-led strength training programs.',
      image: 'https://images.unsplash.com/photo-1571019625454-e05e1679078f?w=800&q=80',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="MultiFit Aundh Gym"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-[#F5F5F5] px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Unleash Your Potential at MultiFit Aundh
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Experience high-energy workouts, expert trainers, and a supportive community that pushes you further.
          </p>
          <Link
            href="/trial"
            className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Class Highlights Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
            Our Signature Classes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {classHighlights.map((cls, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">{cls.title}</h3>
                <p className="text-gray-700 leading-relaxed">{cls.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <TestimonialsSection />
        </div>
      </section>

      {/* Trial Lead Form Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
            Ready to Transform? Grab Your Free Trial!
          </h2>
          <TrialForm />
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;