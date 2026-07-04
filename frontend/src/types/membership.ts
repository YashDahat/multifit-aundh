export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}