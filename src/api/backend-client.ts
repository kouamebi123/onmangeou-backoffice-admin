/**
 * Client HTTP serveur vers l'API Nest.
 *
 * Les jetons JWT restent cote serveur (cookies HttpOnly poses par le BFF).
 * Ce module n'est jamais importe dans un Client Component.
 */

import { ApiError, parseProblem, unwrapEnvelope } from '@/api/envelope';
import type { ResponseEnvelope } from '@/api/envelope';
import { t } from '@/i18n/messages';

export const DEFAULT_API_BASE_URL = 'https://onmangeou-backend-api-production.up.railway.app/api/v1';

export function apiBaseUrl(): string {
  const configured = process.env['API_BASE_URL'] ?? process.env['ONMANGEOU_API_BASE_URL'];
  const origin = (configured ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
  return origin.endsWith('/api/v1') ? origin : `${origin}/api/v1`;
}

export interface BackendRequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
  idempotencyKey?: string;
  deviceInstallId?: string;
}

export async function callBackend<T>(
  path: string,
  init: BackendRequestInit = {},
): Promise<ResponseEnvelope<T> | null> {
  const headers = new Headers();
  headers.set('Accept', 'application/json');

  if (init.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (init.accessToken) {
    headers.set('Authorization', `Bearer ${init.accessToken}`);
  }

  if (init.idempotencyKey) {
    headers.set('Idempotency-Key', init.idempotencyKey);
  }

  if (init.deviceInstallId) {
    headers.set('X-Device-Install-Id', init.deviceInstallId);
  }

  headers.set('X-Request-Id', crypto.randomUUID());

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
    });
  } catch {
    throw new ApiError({
      type: 'https://api.onmangeou.ci/problems/internal-error',
      title: 'Incident temporaire',
      status: 502,
      code: 'INTERNAL_ERROR',
      detail: t('states.network'),
      requestId: '',
      fields: [],
    });
  }

  if (response.status === 204) {
    return null;
  }

  const raw: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(parseProblem(raw, response.status));
  }

  return unwrapEnvelope<T>(raw);
}
