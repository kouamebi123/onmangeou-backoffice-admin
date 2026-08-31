import { countEstablishments, countOpenVerificationCases, countUsers } from '@/api/admin';
import { DashboardView } from '@/features/dashboard/dashboard-view';
import { t } from '@/i18n/messages';

export default async function DashboardPage() {
  const [openCases, establishments, users] = await Promise.all([
    countOpenVerificationCases(),
    countEstablishments(),
    countUsers(),
  ]);

  return (
    <div className="stack">
      <header className="page-header">
        <p className="page-kicker">{t('dashboard.kicker')}</p>
        <h1>{t('dashboard.title')}</h1>
        <p className="muted">{t('dashboard.intro')}</p>
      </header>
      <DashboardView openCases={openCases} establishments={establishments} users={users} />
    </div>
  );
}
