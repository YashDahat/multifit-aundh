import { TrainerDto } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TrainerGridProps {
  trainers: TrainerDto[];
}

const TrainerCard: React.FC<{ trainer: TrainerDto }> = ({ trainer }) => {
  return (
    <Link to={ROUTES.TRAINER_DETAIL.replace(':id', trainer.id ?? '')}>
      <Card className="h-full flex flex-col items-center text-center p-4 transition-all duration-200 hover:shadow-lg hover:border-[#DFFF00]">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={trainer.imageUrl ?? undefined} alt={trainer.name ?? 'Trainer'} />
            <AvatarFallback>{trainer.name?.charAt(0) ?? 'T'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold">{trainer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{trainer.specialization}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export const TrainerGrid: React.FC<TrainerGridProps> = ({ trainers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} />
      ))}
    </div>
  );
};