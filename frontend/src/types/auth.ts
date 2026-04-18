export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
