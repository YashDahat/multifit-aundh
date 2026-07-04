export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  features: string[];
  active: boolean;
}