import React from 'react';
import { useTestimonials } from '@/hooks/useMarketingContent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';

export function TestimonialsSection() {
  const { data: testimonials, isLoading, isError } = useTestimonials();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-red-500">Failed to load testimonials.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#DFFF00] mb-4">
          Hear It From Our Tribe: Real MultiFit Aundh Success Stories!
        </h2>
        <p className="text-lg text-[#F5F5F5] mb-8">
          Join the community that's transforming lives and redefining fitness.
        </p>

        {testimonials && testimonials.length > 0 ? (
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            className="mySwiper pb-12" // Added padding-bottom for pagination dots
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5] h-full flex flex-col justify-between">
                  <p className="text-xl italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-auto">
                    {testimonial.imageUrl && (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-[#DFFF00]">
                        {testimonial.author}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-[#DFFF00] mr-1" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-lg text-[#F5F5F5]">No testimonials available yet.</p>
        )}

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-[#F5F5F5] mb-6">
            Ready to Write Your Own Success Story?
          </h3>
          <a
            href="/memberships"
            className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 inline-block"
          >
            Join MultiFit Aundh Today!
          </a>
        </div>
      </div>
    </section>
  );
}