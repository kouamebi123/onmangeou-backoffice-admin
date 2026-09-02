import { fetchAdminCapabilities } from '@/api/admin';
import { listAdminOrders } from '@/api/admin';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { RefundOrderButton } from '@/features/moderation/moderation-buttons';
import { t } from '@/i18n/messages';

export default async function OrdersPage() {
  const items = await listAdminOrders();

  const canWrite = (await fetchAdminCapabilities()).includes('admin.payment.refund');

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('orders.title')}</h1>
        <p className="notice">
          Supervision des tickets marketplace. Le remboursement sandbox n’appelle aucun prestataire
          réel.
        </p>
      </header>
      {items.length === 0 ? (
        <EmptyState title={t('orders.empty')} />
      ) : (
        <DataTable
          rows={items}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'ref', header: 'Réf', render: (row) => row.public_ref },
            { key: 'resto', header: 'Établissement', render: (row) => row.establishment_name },
            { key: 'status', header: 'Statut', render: (row) => row.status },
            { key: 'payment', header: 'Paiement', render: (row) => row.payment_status ?? '—' },
            {
              key: 'actions',
              header: '',
              render: (row) =>
                canWrite && row.payment_status === 'SUCCEEDED' ? <RefundOrderButton orderId={row.id} /> : null,
            },
          ]}
        />
      )}
    </div>
  );
}
