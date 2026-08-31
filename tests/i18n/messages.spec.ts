import { describe, expect, it } from 'vitest';
import { statusLabel, t } from '@/i18n/messages';

describe('i18n fr-CI', () => {
  it('lit les messages du bandeau nominatif', () => {
    expect(t('app.nominativeBanner')).toContain('impersonation');
  });

  it('traduit les statuts connus et conserve les inconnus', () => {
    expect(statusLabel('OPEN')).toBe('Ouvert');
    expect(statusLabel('INCONNU')).toBe('INCONNU');
  });
});
