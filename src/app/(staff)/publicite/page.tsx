import { adminGet, fetchAdminCapabilities } from '@/api/admin';
import { t } from '@/i18n/messages';
import { CampaignDecision } from '@/features/advertising/decision';
export default async function AdvertisingPage() {
  const canWrite = (await fetchAdminCapabilities()).includes('admin.ad.moderate');
  const list =
    await adminGet<
      Array<{
        id: string;
        title: string;
        establishment_name: string;
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED';
        starts_at: string;
        ends_at: string;
        impressions: string;
        clicks: string;
      }>
    >('/admin/ad-campaigns');
  return (
    <div className="stack">
      <h1>{t('ads.title')}</h1>
      <p className="notice">{t('ads.hint')}</p>
      {list.data.length === 0 ? <p>{t('ads.empty')}</p> : null}
      {list.data.map((c) => (
        <article key={c.id} className="card stack">
          <h2>{c.title}</h2>
          <p>
            {c.establishment_name} · {t(`ads.${c.status}`)}
          </p>
          <p>
            {new Date(c.starts_at).toLocaleDateString('fr-CI')} —{' '}
            {new Date(c.ends_at).toLocaleDateString('fr-CI')}
          </p>
          <p>
            {c.impressions} {t('ads.impressions')} · {c.clicks} {t('ads.clicks')}
          </p>
          {canWrite ? <CampaignDecision id={c.id} /> : null}
        </article>
      ))}
    </div>
  );
}
