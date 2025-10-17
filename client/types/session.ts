export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  permissions: string[];
}

export interface SessionInfo {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  ipAddress: string;
  userAgent: string;
  activeOrganizationId?: string | null;
  activeTeamId?: string | null;
  impersonatedBy?: string | null;
}

export interface SessionData {
  session: SessionInfo;
  user: SessionUser;
}
