// libs/auth/src/lib/models/auth.model.ts

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
  tenantId?: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  iat: number;
  exp: number;
  tenantId?: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
  token?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}
