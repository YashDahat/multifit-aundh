export interface TrainerDto {
  id: string | null;
  name: string | null;
  specialization: string | null;
  bio: string | null;
  imageUrl: string | null;
}

export interface TestimonialDto {
  id: string | null;
  authorName: string | null;
  rating: number | null;
  content: string | null;
  displayDate: string | null;
}

export interface TrialLeadDto {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
}