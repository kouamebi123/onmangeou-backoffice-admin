'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/i18n/messages';
import { NominativeBanner } from '@/components/nominative-banner';
import { LogoutButton } from '@/components/logout-button';

const LINKS = [
  { href: '/', labelKey: 'nav.dashboard' as const },
  { href: '/verification', labelKey: 'nav.verification' as const },
  { href: '/etablissements', labelKey: 'nav.establishments' as const },
  { href: '/audit', labelKey: 'nav.audit' as const },
  { href: '/commandes', labelKey: 'nav.orders' as const },
  { href: '/utilisateurs', labelKey: 'nav.users' as const },
  { href: '/avis', labelKey: 'nav.reviews' as const },
  { href: '/support', labelKey: 'nav.support' as const },
  { href: '/abonnements', labelKey: 'nav.billing' as const },
];

export function AppShell({ children, actorLabel }: { children: ReactNode; actorLabel: string }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="shell__nav">
        <div className="shell__brand">
          <Image
            src="/brand/onmangeou-logo-full-dark.svg"
            alt={t('app.name')}
            width={140}
            height={91}
            unoptimized
          />
          <p className="muted">{actorLabel}</p>
        </div>
        <nav className="shell__links" aria-label={t('app.title')}>
          {LINKS.map((link) => {
            const current =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="shell__link"
                aria-current={current ? 'page' : undefined}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
        <LogoutButton />
      </aside>
      <div className="shell__main">
        <NominativeBanner />
        <main className="shell__content">{children}</main>
      </div>
    </div>
  );
}
