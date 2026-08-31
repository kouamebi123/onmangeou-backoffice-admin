import { NextResponse, type NextRequest } from 'next/server';
import { callBackend } from '@/api/backend-client';
import { secondsUntil } from '@/api/envelope';
import type { TokenPair } from '@/api/types';
import { ACCESS_COOKIE, REFRESH_COOKIE, buildSessionCookieOptions } from '@/auth/cookies';

const PUBLIC_PREFIXES = ['/connexion', '/api/session/otp', '/brand'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }
  return false;
}

function applySessionCookies(response: NextResponse, tokens: TokenPair): void {
  const nodeEnv = process.env.NODE_ENV;
  response.cookies.set(
    ACCESS_COOKIE,
    tokens.accessToken,
    buildSessionCookieOptions({
      nodeEnv,
      maxAgeSeconds: secondsUntil(tokens.accessTokenExpiresAt),
    }),
  );
  response.cookies.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    buildSessionCookieOptions({
      nodeEnv,
      maxAgeSeconds: secondsUntil(tokens.refreshTokenExpiresAt),
    }),
  );
}

function clearSessionCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

async function rotateRefresh(refreshToken: string): Promise<TokenPair | null> {
  try {
    const envelope = await callBackend<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
    return envelope?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Proxy reseau Next.js 16 (ex-middleware) : protege les pages internes.
 * La verification d'autorisation metier (platformRole) reste dans le layout.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (isPublicPath(pathname)) {
    if (pathname.startsWith('/connexion') && access) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/session')) {
    return NextResponse.next();
  }

  if (!access && !refresh) {
    const login = new URL('/connexion', request.url);
    return NextResponse.redirect(login);
  }

  if (!access && refresh) {
    const tokens = await rotateRefresh(refresh);
    if (!tokens) {
      const login = NextResponse.redirect(new URL('/connexion', request.url));
      clearSessionCookies(login);
      return login;
    }
    const next = NextResponse.next();
    applySessionCookies(next, tokens);
    return next;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand/).*)'],
};
