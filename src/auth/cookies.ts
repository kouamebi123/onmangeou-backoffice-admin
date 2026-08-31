export const ACCESS_COOKIE = 'omo_access';
export const REFRESH_COOKIE = 'omo_refresh';

export interface SessionCookieOptions {
  httpOnly: true;
  sameSite: 'lax';
  secure: boolean;
  path: '/';
  maxAge: number;
}

/**
 * Secure n'est actif qu'en production : le back-office local tourne en HTTP.
 */
export function cookieSecureFlag(nodeEnv: string | undefined): boolean {
  return nodeEnv === 'production';
}

export function buildSessionCookieOptions(params: {
  nodeEnv: string | undefined;
  maxAgeSeconds: number;
}): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecureFlag(params.nodeEnv),
    path: '/',
    maxAge: Math.max(1, params.maxAgeSeconds),
  };
}

export function hasSessionCookies(cookies: { access?: string; refresh?: string }): boolean {
  return Boolean(cookies.access) || Boolean(cookies.refresh);
}
