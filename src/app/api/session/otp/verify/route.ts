import { NextResponse } from 'next/server';
import { ApiError, secondsUntil } from '@/api/envelope';
import { callBackend } from '@/api/backend-client';
import type { TokenPair } from '@/api/types';
import { ACCESS_COOKIE, REFRESH_COOKIE, buildSessionCookieOptions } from '@/auth/cookies';

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        type: 'https://api.onmangeou.ci/problems/validation-failed',
        title: 'Informations incompletes',
        status: 400,
        code: 'VALIDATION_FAILED',
        detail: 'Le corps de la requete est illisible.',
        requestId: '',
        fields: [],
      },
      { status: 400, headers: { 'content-type': 'application/problem+json' } },
    );
  }

  try {
    const envelope = await callBackend<TokenPair>('/auth/otp/verify', {
      method: 'POST',
      body,
    });

    if (!envelope) {
      throw new Error('Jeton manquant apres verification OTP.');
    }

    const nodeEnv = process.env.NODE_ENV;
    const response = NextResponse.json({
      data: { sessionId: envelope.data.sessionId, accountCreated: envelope.data.accountCreated },
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
        detail: 'La verification du code a echoue.',
        requestId: '',
        fields: [],
      },
      { status: 502, headers: { 'content-type': 'application/problem+json' } },
    );
  }
}
