export type PlatformRole = 'ADMIN' | 'SUPPORT';

export interface OtpRequested {
  challengeId: string;
  expiresAt: string;
  expiresInSeconds: number;
  devCode?: string;
}

export interface TokenPair {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  sessionId: string;
  accountCreated: boolean;
}

export interface MeProfile {
  id: string;
  phoneE164: string;
  email: string | null;
  fullName: string | null;
  status: string;
  language: string;
  phoneVerified: boolean;
  avatarUrl: string | null;
  defaultCity: string | null;
  defaultDistrict: string | null;
  createdAt: string;
  memberships: Array<{
    organizationId: string;
    organizationName: string;
    roleCode: string;
    establishmentIds: string[];
  }>;
  platformRole: PlatformRole | null;
}

export type VerificationStatus = 'OPEN' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export interface VerificationCase {
  id: string;
  status: string;
  organizationId: string;
  organizationName: string;
  establishmentId: string | null;
  establishmentName: string | null;
  establishmentSlug: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  decisionReason: string | null;
}

export interface AdminEstablishment {
  id: string;
  name: string;
  slug: string;
  status: string;
  city: string;
  district: string | null;
  organizationId: string;
  organizationName: string;
  verifiedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  phoneE164: string;
  fullName: string | null;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  organizationNames: string[];
}

export interface AdminOrder {
  id: string;
  public_ref: string;
  status: string;
  establishment_name: string;
  payment_status: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  organizationId: string | null;
  actorUserId: string | null;
  reason: string | null;
  occurredAt: string;
}

export interface PageQuery {
  limit?: number;
  cursor?: string;
  status?: VerificationStatus;
  establishmentStatus?: string;
}
