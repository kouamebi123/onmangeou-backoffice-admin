'use client';

import { useRouter } from 'next/navigation';
import { t } from '@/i18n/messages';
import { Button } from '@/components/button';

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch('/api/session/logout', { method: 'POST' });
    router.replace('/connexion');
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={() => void onLogout()}>
      {t('nav.logout')}
    </Button>
  );
}
