import type { AuditLog } from '@/api/types';
import { formatDateTime } from '@/api/format';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { t } from '@/i18n/messages';

export function AuditList({ items }: { items: AuditLog[] }) {
  if (items.length === 0) {
    return <EmptyState title={t('audit.empty')} />;
  }

  return (
    <DataTable
      rows={items}
      getRowKey={(row) => row.id}
      columns={[
        { key: 'action', header: t('audit.action'), render: (row) => row.action },
        {
          key: 'resource',
          header: t('audit.resource'),
          render: (row) => `${row.resourceType}${row.resourceId ? ` · ${row.resourceId}` : ''}`,
        },
        { key: 'actor', header: t('audit.actor'), render: (row) => row.actorUserId ?? '—'},
        { key: 'reason', header: t('audit.reason'), render: (row) => row.reason ?? '—'},
        {
          key: 'occurredAt',
          header: t('audit.occurredAt'),
          render: (row) => formatDateTime(row.occurredAt),
        },
      ]}
    />
  );
}
