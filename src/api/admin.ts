import { callBackend } from '@/api/backend-client';
import type { ResponseEnvelope } from '@/api/envelope';
import type {
  AdminEstablishment,
  AdminOrder,
  AdminUser,
  AuditLog,
  PageQuery,
  VerificationCase,
} from '@/api/types';
import { readAccessToken } from '@/auth/session';
import { redirect } from 'next/navigation';

const PAGE_LIMIT = 50;
const MAX_PAGES = 20;

function queryString(query: PageQuery): string {
  const params = new URLSearchParams();
  params.set('limit', String(query.limit ?? PAGE_LIMIT));
  if (query.cursor) {
    params.set('cursor', query.cursor);
  }
  if (query.status) {
    params.set('status', query.status);
  }
  if (query.establishmentStatus) {
    params.set('establishmentStatus', query.establishmentStatus);
  }
  return params.toString();
}

async function requireAccess(): Promise<string> {
  const access = await readAccessToken();
  if (!access) {
    redirect('/connexion');
  }
  return access;
}

export async function adminGet<T>(path: string): Promise<ResponseEnvelope<T>> {
  const access = await requireAccess();
  const envelope = await callBackend<T>(path, { accessToken: access });
  if (!envelope) {
    throw new Error(`Reponse vide pour ${path}`);
  }
  return envelope;
}

export async function adminPut<T>(path: string, body: unknown): Promise<T> {
  const access = await requireAccess();
  const envelope = await callBackend<T>(path, {
    method: 'PUT',
    accessToken: access,
    body,
  });
  if (!envelope) {
    throw new Error(`Reponse vide pour ${path}`);
  }
  return envelope.data;
}

export async function adminPost<T>(
  path: string,
  body: unknown,
  idempotencyKey?: string,
): Promise<T> {
  const access = await requireAccess();
  const envelope = await callBackend<T>(path, {
    method: 'POST',
    accessToken: access,
    body,
    ...(idempotencyKey === undefined ? {} : { idempotencyKey }),
  });
  if (!envelope) {
    throw new Error(`Reponse vide pour ${path}`);
  }
  return envelope.data;
}

async function collectPages<T>(path: string, query: PageQuery = {}): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | undefined = query.cursor;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const envelope = await adminGet<T[]>(
      `${path}?${queryString({ ...query, cursor, limit: PAGE_LIMIT })}`,
    );
    items.push(...envelope.data);
    if (!envelope.meta.nextCursor) {
      break;
    }
    cursor = envelope.meta.nextCursor;
  }

  return items;
}

export async function listVerificationCases(
  status?: PageQuery['status'],
): Promise<VerificationCase[]> {
  return collectPages<VerificationCase>('/admin/verification-cases', {
    ...(status === undefined ? {} : { status }),
  });
}

export async function listEstablishments(): Promise<AdminEstablishment[]> {
  return collectPages<AdminEstablishment>('/admin/establishments');
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  return collectPages<AuditLog>('/admin/audit-logs');
}

export async function countOpenVerificationCases(): Promise<number> {
  const cases = await listVerificationCases('OPEN');
  return cases.length;
}

export async function countEstablishments(): Promise<number> {
  const establishments = await listEstablishments();
  return establishments.length;
}

export async function listUsers(): Promise<AdminUser[]> {
  return collectPages<AdminUser>('/admin/users');
}

export async function countUsers(): Promise<number> {
  const users = await listUsers();
  return users.length;
}

export async function listAdminOrders(): Promise<AdminOrder[]> {
  const envelope = await adminGet<AdminOrder[]>('/admin/orders');
  return envelope.data;
}

export async function listAdminReviews(): Promise<
  Array<{
    id: string;
    score: number;
    body: string | null;
    status: string;
    establishment_name: string;
  }>
> {
  const envelope =
    await adminGet<
      Array<{
        id: string;
        score: number;
        body: string | null;
        status: string;
        establishment_name: string;
      }>
    >('/admin/reviews');
  return envelope.data;
}

export interface ModulePriceCatalog {
  currency: string;
  published: boolean;
  notice: string;
  modules: Array<{
    code: string;
    label: string;
    included: boolean;
    monthlyPrice: { amount: string; currency: string; formatted: string };
  }>;
}

export async function fetchModulePrices(): Promise<ModulePriceCatalog> {
  const envelope = await adminGet<ModulePriceCatalog>('/admin/module-prices');
  return envelope.data;
}

export async function listAdminTickets(): Promise<
  Array<{
    id: string;
    subject: string;
    body: string;
    status: string;
    full_name: string | null;
    phone_e164: string;
  }>
> {
  const envelope =
    await adminGet<
      Array<{
        id: string;
        subject: string;
        body: string;
        status: string;
        full_name: string | null;
        phone_e164: string;
      }>
    >('/admin/support-tickets');
  return envelope.data;
}
