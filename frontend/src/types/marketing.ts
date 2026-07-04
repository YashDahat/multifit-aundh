export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  rating: number;
  imageUrl?: string;
}

export interface TrialLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  submissionDate: string;
}

export interface CreateTrialLead {
  name: string;
  email: string;
  phone: string;
}