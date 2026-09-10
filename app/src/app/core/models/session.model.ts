import { SpaceRole } from './enums';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

/** GET /api/auth/me */
export interface Me extends AuthUser {
  hasSpace: boolean;
}

export interface SpaceMember {
  userId: string;
  name: string;
  avatarUrl: string | null;
  role: SpaceRole;
  joinedAt: string;
}

/** GET /api/space */
export interface Space {
  id: string;
  name: string;
  sinceDate: string;
  members: SpaceMember[];
  isComplete: boolean;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** POST /api/auth/login | /register */
export interface AuthSession extends IssuedTokens {
  user: AuthUser;
}
