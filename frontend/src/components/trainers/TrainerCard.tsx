import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainerDto } from '@/types/content';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TrainerCardProps {
  trainer: TrainerDto;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <Link to={ROUTES.TRAINER_DETAIL.replace(':id', trainer.id ?? '')}>
      <Card className="h-full flex flex-col items-center text-center p-6 transition-all duration-200 hover:shadow-lg hover:border-[#DFFF00]">
        <CardHeader className="flex flex-col items-center p-0 pb-4">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={trainer.imageUrl ?? undefined} alt={trainer.name ?? 'Trainer'} />
            <AvatarFallback>{trainer.name?.charAt(0) ?? 'T'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold">{trainer.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-gray-600">{trainer.specialization}</p>
        </CardContent>
      </Card>
    </Link>
  );
}