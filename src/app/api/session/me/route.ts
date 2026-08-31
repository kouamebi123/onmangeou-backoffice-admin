import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiError } from '@/api/envelope';
import { callBackend } from '@/api/backend-client';
import type { MeProfile, TokenPair } from '@/api/types';
import { ACCESS_COOKIE, REFRESH_COOKIE, buildSessionCookieOptions } from '@/auth/cookies';
import { secondsUntil } from '@/api/envelope';

async function accessFromCookies(): Promise<{
  access?: string;
  refresh?: string;
}> {
  const jar = await cookies();
  return {
    ...(jar.get(ACCESS_COOKIE)?.value ? { access: jar.get(ACCESS_COOKIE)?.value } : {}),
    ...(jar.get(REFRESH_COOKIE)?.value ? { refresh: jar.get(REFRESH_COOKIE)?.value } : {}),
  };
}

export async function GET(): Promise<NextResponse> {
  const tokens = await accessFromCookies();
  let access = tokens.access;
  let rotated: TokenPair | undefined;

  if (!access && tokens.refresh) {
    try {
      const envelope = await callBackend<TokenPair>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: tokens.refresh },
      });
      if (envelope) {
        access = envelope.data.accessToken;
        rotated = envelope.data;
      }
    } catch {
      access = undefined;
    }
  }

  if (!access) {
    return NextResponse.json(
      {
        type: 'https://api.onmangeou.ci/problems/unauthenticated',
        title: 'Connexion requise',
        status: 401,
        code: 'UNAUTHENTICATED',
        detail: 'Connectez-vous pour continuer.',
        requestId: '',
        fields: [],
      },
      { status: 401, headers: { 'content-type': 'application/problem+json' } },
    );
  }

  try {
    const envelope = await callBackend<MeProfile>('/me', { accessToken: access });
    const response = NextResponse.json(envelope);

    if (rotated) {
      const nodeEnv = process.env.NODE_ENV;
      response.cookies.set(
        ACCESS_COOKIE,
        rotated.accessToken,
        buildSessionCookieOptions({
          nodeEnv,
          maxAgeSeconds: secondsUntil(rotated.accessTokenExpiresAt),
        }),
      );
      response.cookies.set(
        REFRESH_COOKIE,
        rotated.refreshToken,
        buildSessionCookieOptions({
          nodeEnv,
          maxAgeSeconds: secondsUntil(rotated.refreshTokenExpiresAt),
        }),
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.problem, {
        status: error.problem.status,
        headers: { 'content-type': 'application/problem+json' },
      });
    }

    return NextResponse.json(
      {
        type: 'https://api.onmangeou.ci/problems/internal-error',
        title: 'Incident temporaire',
        status: 502,
        code: 'INTERNAL_ERROR',
        detail: 'Impossible de charger le profil.',
        requestId: '',
        fields: [],
      },
      { status: 502, headers: { 'content-type': 'application/problem+json' } },
    );
  }
}
