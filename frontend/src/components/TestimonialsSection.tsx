import React, { useState, useEffect } from 'react';
import { useTestimonials } from '../hooks/useContent';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading, isError, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Auto-advance every 5 seconds
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  const handlePrev = () => {
    if (testimonials) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
  };

  const handleNext = () => {
    if (testimonials) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Hear From Our Thriving Community!</h2>
          <div className="mb-8 text-2xl font-semibold text-[#DFFF00]">5.0 Google Rating</div>
          <p className="text-lg">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Hear From Our Thriving Community!</h2>
          <div className="mb-8 text-2xl font-semibold text-[#DFFF00]">5.0 Google Rating</div>
          <p className="text-red-500 text-lg">Error loading testimonials: {error?.message}</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Hear From Our Thriving Community!</h2>
          <div className="mb-8 text-2xl font-semibold text-[#DFFF00]">5.0 Google Rating</div>
          <p className="text-lg">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Hear From Our Thriving Community!</h2>
        <div className="text-center mb-8 text-2xl font-semibold text-[#DFFF00]">5.0 Google Rating</div>

        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFFF00]"
            aria-label="Previous testimonial"
          >
            &lt;
          </button>

          {/* Testimonial Card */}
          <div className="bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5] max-w-2xl mx-auto w-full min-h-[250px] flex flex-col justify-between">
            <div>
              <p className="text-lg leading-relaxed mb-4 italic">"{currentTestimonial.feedback}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {currentTestimonial.imageUrl && (
                    <img
                      src={currentTestimonial.imageUrl}
                      alt={currentTestimonial.author}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{currentTestimonial.author}</p>
                    <div className="text-[#DFFF00]">
                      {Array(currentTestimonial.rating).fill('★').join('')}
                      {Array(5 - currentTestimonial.rating).fill('☆').join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFFF00]"
            aria-label="Next testimonial"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;