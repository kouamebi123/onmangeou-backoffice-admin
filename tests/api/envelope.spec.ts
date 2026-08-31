import { describe, expect, it } from 'vitest';
import {
  isEnvelope,
  isProblemDetails,
  parseProblem,
  secondsUntil,
  unwrapEnvelope,
} from '@/api/envelope';

describe('enveloppe API', () => {
  it('reconnait une enveloppe { data, meta }', () => {
    const body = { data: [{ id: '1' }], meta: { requestId: 'req-1', nextCursor: null } };
    expect(isEnvelope(body)).toBe(true);
    expect(unwrapEnvelope(body).data).toEqual([{ id: '1' }]);
  });

  it('refuse un corps hors contrat', () => {
    expect(isEnvelope({ items: [] })).toBe(false);
    expect(() => unwrapEnvelope({ hello: true })).toThrow();
  });

  it('parse une erreur RFC 7807', () => {
    const problem = parseProblem(
      {
        type: 'https://api.onmangeou.ci/problems/unauthenticated',
        title: 'Connexion requise',
        status: 401,
        code: 'UNAUTHENTICATED',
        detail: 'Connectez-vous pour continuer.',
        requestId: 'req-2',
      },
      401,
    );

    expect(isProblemDetails(problem)).toBe(true);
    expect(problem.fields).toEqual([]);
    expect(problem.code).toBe('UNAUTHENTICATED');
  });

  it('calcule une duree de cookie d au moins une seconde', () => {
    expect(secondsUntil('not-a-date', 0)).toBe(60);
    expect(secondsUntil(new Date(10_000).toISOString(), 0)).toBeGreaterThanOrEqual(1);
  });
});
