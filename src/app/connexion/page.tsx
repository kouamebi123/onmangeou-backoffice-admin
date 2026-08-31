import Image from 'next/image';
import { ConnexionForm } from '@/features/auth/connexion-form';
import { t } from '@/i18n/messages';

export default function ConnexionPage() {
  return (
    <main className="login">
      <section className="login__brand">
        <p className="page-kicker page-kicker--on-dark">{t('auth.kicker')}</p>
        <h1>{t('auth.panelTitle')}</h1>
        <p>{t('auth.panelBody')}</p>
      </section>
      <section className="card login__card stack">
        <Image
          className="login__logo"
          src="/brand/onmangeou-logo-full-light.svg"
          alt={t('app.name')}
          width={180}
          height={117}
          unoptimized
          priority
        />
        <h1>{t('auth.title')}</h1>
        <p className="muted">{t('auth.subtitle')}</p>
        <ConnexionForm />
      </section>
    </main>
  );
}
