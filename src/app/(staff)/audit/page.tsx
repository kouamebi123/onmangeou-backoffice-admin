import { listAuditLogs } from '@/api/admin';
import { AuditList } from '@/features/audit/audit-list';
import { t } from '@/i18n/messages';

export default async function AuditPage() {
  const items = await listAuditLogs();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('audit.title')}</h1>
        <p className="notice">{t('audit.readonly')}</p>
      </header>
      <AuditList items={items} />
    </div>
  );
}
