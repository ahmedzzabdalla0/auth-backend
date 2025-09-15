import { Document } from 'mongoose';
import { User } from 'schemas/user.schema';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: Partial<User>;
  accessToken: string;
}

export interface SignupResponse {
  createdUser: User;
  accessToken: string;
}

export interface RefreshTokenPayload {
  userId: string;
  rtRef: string;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface ValidatedRefreshToken {
  user: User & Document;
  payload: RefreshTokenPayload;
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge?: number;
}

export interface AuthServiceDependencies {
  userModel: any;
  jwtService: any;
  configService: any;
}
