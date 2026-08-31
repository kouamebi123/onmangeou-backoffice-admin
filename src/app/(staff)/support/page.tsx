import { listAdminTickets } from '@/api/admin';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { CloseTicketButton } from '@/features/moderation/moderation-buttons';

export default async function SupportPage() {
  const items = await listAdminTickets();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Support</h1>
        <p className="notice">Tickets envoyés depuis les applications client et restaurant.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState title="Aucun ticket" />
      ) : (
        <DataTable
          rows={items}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'who', header: 'Auteur', render: (row) => row.full_name ?? row.phone_e164 },
            { key: 'subject', header: 'Sujet', render: (row) => row.subject },
            { key: 'body', header: 'Message', render: (row) => row.body },
            { key: 'status', header: 'Statut', render: (row) => row.status },
            {
              key: 'actions',
              header: '',
              render: (row) => (row.status === 'OPEN' ? <CloseTicketButton ticketId={row.id} /> : null),
            },
          ]}
        />
      )}
    </div>
  );
}
