import React from 'react';
import { useAllTrainers } from '../hooks/useContent';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading, isError, error } = useAllTrainers();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            WHAT OUR MEMBERS SAY: REAL RESULTS, REAL COMMUNITY.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-700 rounded mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-12">
            WHAT OUR MEMBERS SAY: REAL RESULTS, REAL COMMUNITY.
          </h2>
          <p className="text-red-500">Error loading testimonials: {error?.message}</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-12">
            WHAT OUR MEMBERS SAY: REAL RESULTS, REAL COMMUNITY.
          </h2>
          <div className="p-8 border border-gray-700 rounded-lg bg-[#333333]">
            <p className="text-lg text-gray-400">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
          WHAT OUR MEMBERS SAY: REAL RESULTS, REAL COMMUNITY.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5] flex flex-col justify-between"
            >
              <div>
                <p className="text-lg italic mb-4 leading-relaxed">
                  "{testimonial.description}"
                </p>
              </div>
              <p className="font-semibold text-[#DFFF00] text-right mt-4">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;