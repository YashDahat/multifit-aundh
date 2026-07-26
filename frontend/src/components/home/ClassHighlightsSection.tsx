import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GymClassDto } from '@/types/gym';

interface ClassHighlightsSectionProps {
  gymClasses: GymClassDto[];
}

export function ClassHighlightsSection({ gymClasses }: ClassHighlightsSectionProps) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Our Signature Classes
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Find your passion, push your limits.
        </p>

        {gymClasses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No classes available at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gymClasses.map((gymClass) => (
              <Card key={gymClass.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {gymClass.name ?? 'Unnamed Class'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {gymClass.trainerName ? `with ${gymClass.trainerName}` : 'Trainer not assigned'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {gymClass.description ?? 'No description available.'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}