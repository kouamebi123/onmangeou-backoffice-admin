import { NextResponse } from 'next/server';
import { ApiError } from '@/api/envelope';
import { callBackend } from '@/api/backend-client';
import type { OtpRequested } from '@/api/types';

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
    const envelope = await callBackend<OtpRequested>('/auth/otp/request', {
      method: 'POST',
      body,
    });

    return NextResponse.json(envelope, { status: 202 });
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
        detail: 'Le service de connexion est temporairement indisponible.',
        requestId: '',
        fields: [],
      },
      { status: 502, headers: { 'content-type': 'application/problem+json' } },
    );
  }
}
