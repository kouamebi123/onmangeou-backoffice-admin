import Link from 'next/link';
import { MetricCard } from '@/components/metric-card';
import { t } from '@/i18n/messages';

export function DashboardView({
  openCases,
  establishments,
  users,
}: {
  openCases: number;
  establishments: number;
  users: number;
}) {
  return (
    <div className="stack">
      <section className="metrics">
        <MetricCard
          label={t('dashboard.openCases')}
          value={String(openCases)}
          hint={t('dashboard.openCasesHint')}
          href="/verification"
          actionLabel={t('dashboard.openQueue')}
        />
        <MetricCard
          label={t('dashboard.establishments')}
          value={String(establishments)}
          hint={t('dashboard.establishmentsHint')}
          href="/etablissements"
          actionLabel={t('dashboard.browseEstablishments')}
        />
        <MetricCard
          label={t('dashboard.users')}
          value={String(users)}
          hint={t('dashboard.usersHint')}
          href="/utilisateurs"
          actionLabel={t('dashboard.browseUsers')}
        />
      </section>
      <article className="card next-card">
        <h2>{t('dashboard.nextTitle')}</h2>
        <p className="muted">{t('dashboard.nextBody')}</p>
        <Link className="btn btn--primary" href="/verification">
          {t('dashboard.openQueue')}
        </Link>
      </article>
    </div>
  );
}
