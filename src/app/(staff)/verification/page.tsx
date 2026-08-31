import { listVerificationCases } from '@/api/admin';
import { requireStaff } from '@/auth/session';
import { VerificationList } from '@/features/verification/verification-list';
import { t } from '@/i18n/messages';

export default async function VerificationPage() {
  const me = await requireStaff();
  const items = await listVerificationCases();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('verification.title')}</h1>
      </header>
      <VerificationList items={items} canDecide={me.platformRole === 'ADMIN'} />
    </div>
  );
}
