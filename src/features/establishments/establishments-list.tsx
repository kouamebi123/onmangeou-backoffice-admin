import type { AdminEstablishment } from '@/api/types';
import { formatDateTime } from '@/api/format';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { StatusChip } from '@/components/status-chip';
import { t } from '@/i18n/messages';

export function EstablishmentsList({ items }: { items: AdminEstablishment[] }) {
  if (items.length === 0) {
    return <EmptyState title={t('establishments.empty')} />;
  }

  return (
    <DataTable
      rows={items}
      getRowKey={(row) => row.id}
      columns={[
        { key: 'name', header: t('establishments.name'), render: (row) => row.name },
        {
          key: 'organization',
          header: t('establishments.organization'),
          render: (row) => row.organizationName,
        },
        {
          key: 'city',
          header: t('establishments.city'),
          render: (row) => (row.district ? `${row.city} · ${row.district}` : row.city),
        },
        {
          key: 'status',
          header: t('establishments.status'),
          render: (row) => <StatusChip status={row.status} />,
        },
        {
          key: 'verifiedAt',
          header: t('establishments.verifiedAt'),
          render: (row) => formatDateTime(row.verifiedAt),
        },
      ]}
    />
  );
}
