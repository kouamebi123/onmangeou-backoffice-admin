import { t } from '@/i18n/messages';

/** Signature discrète de l'éditeur, en pied de page. */
export function Signature({ onDark = false }: { onDark?: boolean }) {
  return (
    <p className={onDark ? 'signature signature--on-dark' : 'signature'}>
      {t('app.signedBy')}{' '}
      <a href="https://binuxlabs.com" target="_blank" rel="noopener noreferrer">
        BinuxLabs
      </a>
    </p>
  );
}
