import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { NominativeBanner } from '@/components/nominative-banner';
import { fetchMe } from '@/auth/session';
import { t } from '@/i18n/messages';

export default async function AccesRefusePage() {
  const me = await fetchMe();

  if (!me) {
    redirect('/connexion');
  }

  if (me.platformRole !== null) {
    redirect('/');
  }

  return (
    <div>
      <NominativeBanner />
      <main className="login">
        <section className="card login__card stack">
          <h1>{t('accessDenied.title')}</h1>
          <p>{t('accessDenied.body')}</p>
          <LogoutButton />
        </section>
      </main>
    </div>
  );
}
