import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { callBackend } from '@/api/backend-client';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/auth/cookies';

export async function POST(): Promise<NextResponse> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;

  if (access) {
    try {
      await callBackend('/auth/logout', {
        method: 'POST',
        accessToken: access,
        body: {},
      });
    } catch {
      // La session locale est fermee meme si l'API est injoignable.
    }
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
