import { useContent } from '@/hooks/useContent';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Assuming cn is available for utility class merging

const TestimonialsSection = () => {
  const { testimonialsQuery } = useContent();
  const { data: testimonials, isLoading, isError } = testimonialsQuery;

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            Hear From Our Community
          </h2>
          <p className="text-center text-gray-700 mb-12">Real stories, real results.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-6">
                <CardContent className="flex flex-col items-center text-center p-0">
                  <Skeleton className="w-16 h-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-300 fill-gray-300" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          Failed to load testimonials. Please try again later.
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-700">
          <p className="text-lg">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
          Hear From Our Community
        </h2>
        <p className="text-center text-gray-700 mb-12">Real stories, real results.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <CardContent className="flex flex-col items-center text-center p-0">
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.authorName}`} alt={testimonial.authorName ?? 'Author'} />
                  <AvatarFallback>{testimonial.authorName?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">{testimonial.authorName}</h3>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < (testimonial.rating ?? 0) ? 'text-[#DFFF00] fill-[#DFFF00]' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;