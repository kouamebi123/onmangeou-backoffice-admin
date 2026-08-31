import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiError, secondsUntil } from '@/api/envelope';
import { callBackend } from '@/api/backend-client';
import type { TokenPair } from '@/api/types';
import { ACCESS_COOKIE, REFRESH_COOKIE, buildSessionCookieOptions } from '@/auth/cookies';

export async function POST(): Promise<NextResponse> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
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
    const envelope = await callBackend<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });

    if (!envelope) {
      throw new Error('Jeton manquant apres renouvellement.');
    }

    const nodeEnv = process.env.NODE_ENV;
    const response = NextResponse.json({
      data: { sessionId: envelope.data.sessionId },
      meta: envelope.meta,
    });

    response.cookies.set(
      ACCESS_COOKIE,
      envelope.data.accessToken,
      buildSessionCookieOptions({
        nodeEnv,
        maxAgeSeconds: secondsUntil(envelope.data.accessTokenExpiresAt),
      }),
    );
    response.cookies.set(
      REFRESH_COOKIE,
      envelope.data.refreshToken,
      buildSessionCookieOptions({
        nodeEnv,
        maxAgeSeconds: secondsUntil(envelope.data.refreshTokenExpiresAt),
      }),
    );

    return response;
  } catch (error) {
    const response =
      error instanceof ApiError
        ? NextResponse.json(error.problem, {
            status: error.problem.status,
            headers: { 'content-type': 'application/problem+json' },
          })
        : NextResponse.json(
            {
              type: 'https://api.onmangeou.ci/problems/session-expired',
              title: 'Session expiree',
              status: 401,
              code: 'SESSION_EXPIRED',
              detail: 'Votre session a expire. Connectez-vous a nouveau.',
              requestId: '',
              fields: [],
            },
            { status: 401, headers: { 'content-type': 'application/problem+json' } },
          );

    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }
}
