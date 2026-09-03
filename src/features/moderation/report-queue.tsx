import Image from 'next/image';
import { adminGet } from '@/api/admin';
import { apiBaseUrl } from '@/api/backend-client';
import { t } from '@/i18n/messages';
import { ReportDecision } from './report-decision';
export async function ReportQueue({ canWrite }: { canWrite: boolean }) {
  const reasons: Record<string, string> = {
    SPAM: t('reviewReports.spam'),
    ABUSE: t('reviewReports.abuse'),
    PRIVACY: t('reviewReports.privacy'),
    MISLEADING: t('reviewReports.misleading'),
    OTHER: t('reviewReports.other'),
  };
  const reports =
    await adminGet<
      Array<{
        id: string;
        review_id: string;
        reason: string;
        detail: string | null;
        body: string | null;
        establishment_name: string;
        photos: string[];
        review_status: string;
      }>
    >('/admin/review-reports');
  return (
    <section className="stack">
      <h2>{t('reviewReports.title')}</h2>
      <p className="notice">{t('reviewReports.hint')}</p>
      {!reports.data.length ? <p>{t('reviewReports.empty')}</p> : null}
      {reports.data.map((item) => (
        <article key={item.id} className="card stack">
          <h3>{item.establishment_name}</h3>
          <p>
            {reasons[item.reason] ?? t('reviewReports.other')}
            {item.detail ? ` · ${item.detail}` : ''}
          </p>
          <blockquote>{item.body}</blockquote>
          {item.review_status === 'PUBLISHED' ? (
            <div>
              {item.photos.map((photo) => (
                <Image
                  key={photo}
                  src={`${apiBaseUrl()}/reviews/${item.review_id}/photos/${photo}/file`}
                  width={120}
                  height={120}
                  unoptimized
                  alt={t('reviewReports.photo')}
                />
              ))}
            </div>
          ) : null}
          {canWrite ? <ReportDecision id={item.id} /> : null}
        </article>
      ))}
    </section>
  );
}
