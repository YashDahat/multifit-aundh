import React from 'react';
import Layout from '@/components/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F5F5F5] leading-tight">
            Our Story: More Than Just a Gym
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F5F5] opacity-90 mt-4">
            Discover the MultiFit Aundh philosophy and what drives our passion for fitness.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[#F5F5F5] py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1A1A1A] mb-8">
            Our Philosophy: Empowering Your Fitness Journey
          </h2>
          <div className="text-[#333333] leading-relaxed text-lg max-w-3xl mx-auto">
            <p className="mb-4">
              At MultiFit Aundh, we believe fitness is a journey of self-discovery and empowerment, not just a destination. Our philosophy is rooted in creating a supportive, high-energy environment where every member feels motivated to push their limits and achieve their personal best. We are more than just a gym; we are a community dedicated to holistic well-being.
            </p>
            <p className="mb-4">
              We focus on personalized guidance, offering expert-led training programs tailored to individual needs and goals. Our state-of-the-art facilities and diverse range of classes ensure that there's something for everyone, whether you're a seasoned athlete or just starting your fitness adventure. We champion a balanced approach, emphasizing not only physical strength but also mental resilience and overall health.
            </p>
            <p>
              Join us at MultiFit Aundh and experience a fitness culture that inspires, challenges, and transforms. Together, we'll unlock your full potential and build a healthier, happier you.
            </p>
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="bg-gray-100 py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1A1A1A] mb-4">
            Explore Our State-of-the-Art Facility
          </h2>
          <p className="text-lg text-center text-[#333333] mb-12">
            Take a 360-degree virtual tour of MultiFit Aundh.
          </p>
          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=..." // Placeholder YouTube embed
              title="MultiFit Aundh Virtual Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Team Intro Section */}
      <section className="bg-[#F5F5F5] py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1A1A1A] mb-4">
            Meet Our Expert Trainers
          </h2>
          <p className="text-lg text-center text-[#333333] mb-12">
            Dedicated professionals committed to your success.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trainer Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80"
                alt="Trainer John Doe"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">John Doe</h3>
              <p className="text-[#333333]">Strength & Conditioning Specialist</p>
            </div>
            {/* Trainer Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1542838686-374667117765?w=400&q=80"
                alt="Trainer Jane Smith"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Jane Smith</h3>
              <p className="text-[#333333]">Yoga & Flexibility Expert</p>
            </div>
            {/* Trainer Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b73528c311a?w=400&q=80"
                alt="Trainer Alex Johnson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Alex Johnson</h3>
              <p className="text-[#333333]">HIIT & Functional Training Coach</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;