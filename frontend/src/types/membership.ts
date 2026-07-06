// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

import type { User } from '@/types/user';

export interface MembershipDto {
  id: string | null;
  name: string;
  description: string;
  price: number;
  durationInMonths: number;
  membershipType: MembershipType;
  isActive: boolean | null;
}

export type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'STANDARD' | 'PREMIUM';

export interface UserMembership {
  id: string;
  user: User | null;
  membership: Membership | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean | null;
}

export interface Membership {
  id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  durationInMonths: number | null;
  membershipType: MembershipType | null;
  isActive: boolean | null;
}

