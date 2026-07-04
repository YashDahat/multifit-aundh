import React from 'react';
import Layout from '@/components/Layout';
import TrialLeadForm from '@/components/TrialLeadForm';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Potential at MultiFit Aundh</h1>
          <p className="text-xl md:text-2xl mt-4 mb-8">
            Experience the antidote to boring gyms. Join our vibrant community and transform your fitness journey.
          </p>
          <a
            href="#trial-form"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200 inline-block"
          >
            Get a 3-Day Free Trial
          </a>
          <div id="trial-form" className="mt-12 max-w-md mx-auto">
            <TrialLeadForm />
          </div>
        </div>
      </section>

      {/* Class Offerings Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-12">Our Dynamic Classes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Class Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1571019625454-f44237731d1f?w=400&q=80" alt="HIIT Class" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">High-Intensity Interval Training (HIIT)</h3>
              <p className="text-gray-700 leading-relaxed">Push your limits with our energizing HIIT sessions designed for maximum calorie burn and endurance.</p>
            </div>
            {/* Class Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1544367524-89f4b76c017d?w=400&q=80" alt="Yoga Class" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Yoga & Flexibility</h3>
              <p className="text-gray-700 leading-relaxed">Find your balance and inner peace with our diverse yoga classes, suitable for all levels.</p>
            </div>
            {/* Class Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1590487988256-9ddf166f1d0a?w=400&q=80" alt="Strength Training Class" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strength & Conditioning</h3>
              <p className="text-gray-700 leading-relaxed">Build muscle, increase strength, and sculpt your body with our expert-led strength training programs.</p>
            </div>
            {/* Class Card 4 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1579126038374-6064e9370f0f?w=400&q=80" alt="Zumba Class" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zumba & Dance Fitness</h3>
              <p className="text-gray-700 leading-relaxed">Dance your way to fitness with our high-energy Zumba classes – it's a party!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Showcase Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-12">Meet Our Expert Trainers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trainer Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1577221084215-ce184b490710?w=400&q=80" alt="Trainer Alex" className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Alex Johnson</h3>
              <p className="text-[#DFFF00] font-medium mb-3">Strength & Conditioning Specialist</p>
              <p className="text-gray-700 leading-relaxed">Alex is passionate about helping clients build strength and achieve their fitness goals through personalized programs.</p>
            </div>
            {/* Trainer Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1594381837591-23068779606d?w=400&q=80" alt="Trainer Maria" className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Maria Rodriguez</h3>
              <p className="text-[#DFFF00] font-medium mb-3">Yoga & Pilates Instructor</p>
              <p className="text-gray-700 leading-relaxed">Maria guides her students through mindful movements, enhancing flexibility, balance, and inner peace.</p>
            </div>
            {/* Trainer Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center transition-all duration-200 hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" alt="Trainer David" className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">David Lee</h3>
              <p className="text-[#DFFF00] font-medium mb-3">HIIT & Functional Training Coach</p>
              <p className="text-gray-700 leading-relaxed">David brings high energy to every session, motivating clients to push their limits and achieve peak performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;