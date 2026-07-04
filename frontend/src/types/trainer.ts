export interface Trainer {
  id: string;
  name: string;
  slug: string;
  specializations: string[];
  bio: string;
  imageUrl: string;
}

export interface CreateTrainerData {
  name: string;
  slug: string;
  specializations: string[];
  bio: string;
  imageUrl: string;
}

export type { Trainer, CreateTrainerData };