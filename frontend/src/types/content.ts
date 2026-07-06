export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  imageUrl: string;
  socialMediaLinks: Record<string, string>;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  feedback: string;
  imageUrl?: string;
}