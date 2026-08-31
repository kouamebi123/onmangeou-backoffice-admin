import { describe, expect, it } from 'vitest';
import { buildSessionCookieOptions, cookieSecureFlag, hasSessionCookies } from '@/auth/cookies';

describe('cookies de session BFF', () => {
  it('desactive Secure en developpement HTTP local', () => {
    expect(cookieSecureFlag('development')).toBe(false);
    expect(cookieSecureFlag('production')).toBe(true);
  });

  it('pose HttpOnly et SameSite=Lax', () => {
    const options = buildSessionCookieOptions({ nodeEnv: 'development', maxAgeSeconds: 900 });
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe('lax');
    expect(options.secure).toBe(false);
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(900);
  });

  it('detecte une session a partir du refresh seul', () => {
    expect(hasSessionCookies({ refresh: 'r' })).toBe(true);
    expect(hasSessionCookies({})).toBe(false);
  });
});
