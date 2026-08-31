import { listUsers } from '@/api/admin';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { t } from '@/i18n/messages';

export default async function UsersPage() {
  const items = await listUsers();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('users.title')}</h1>
      </header>
      {items.length === 0 ? (
        <EmptyState title={t('users.empty')} />
      ) : (
        <DataTable
          rows={items}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'phone', header: t('users.phone'), render: (row) => row.phoneE164 },
            { key: 'name', header: t('users.name'), render: (row) => row.fullName ?? '—' },
            { key: 'status', header: t('users.status'), render: (row) => row.status },
            {
              key: 'orgs',
              header: t('users.organizations'),
              render: (row) => row.organizationNames.join(', ') || '—',
            },
          ]}
        />
      )}
    </div>
  );
}
