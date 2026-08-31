import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { t } from '@/i18n/messages';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: t('app.title'),
  description: t('app.name'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-CI">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
