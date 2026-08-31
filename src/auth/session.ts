import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError } from '@/api/envelope';
import { callBackend } from '@/api/backend-client';
import type { MeProfile } from '@/api/types';
import { ACCESS_COOKIE } from '@/auth/cookies';

export async function readAccessToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value;
}

export async function fetchMe(): Promise<MeProfile | null> {
  const access = await readAccessToken();
  if (!access) {
    return null;
  }

  try {
    const envelope = await callBackend<MeProfile>('/me', { accessToken: access });
    return envelope?.data ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.problem.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function requireStaff(): Promise<MeProfile> {
  const me = await fetchMe();

  if (!me) {
    redirect('/connexion');
  }

  if (me.platformRole === null) {
    redirect('/acces-refuse');
  }

  return me;
}

export function displayName(me: MeProfile): string {
  return me.fullName ?? me.phoneE164;
}
