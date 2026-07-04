export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface AuthResponse {
  token: string;
  user: User;
}