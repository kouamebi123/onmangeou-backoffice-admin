import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { displayName, requireStaff } from '@/auth/session';

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const me = await requireStaff();

  return <AppShell actorLabel={displayName(me)}>{children}</AppShell>;
}
