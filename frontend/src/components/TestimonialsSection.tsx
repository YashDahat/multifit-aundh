import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Priya S.',
    text: 'MultiFit Aundh completely transformed my fitness journey. The trainers are incredible and the community is so supportive!',
  },
  {
    id: 2,
    name: 'Rahul M.',
    text: 'Best gym in Pune! The HIIT classes are intense but so rewarding. I have lost 10kg in just 3 months.',
  },
  {
    id: 3,
    name: 'Sneha K.',
    text: 'I love the yoga classes here. The instructors are patient and knowledgeable. Highly recommend MultiFit Aundh!',
  },
];

export default function TestimonialsSection(): React.ReactElement {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
        What Our Members Say
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center"
          >
            <p className="text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
            <p className="font-semibold text-[#1A1A1A]">— {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
