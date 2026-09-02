import { fetchAdminCapabilities } from '@/api/admin';
import { listAdminReviews } from '@/api/admin';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { HideReviewButton } from '@/features/moderation/moderation-buttons';

export default async function ReviewsPage() {
  const items = await listAdminReviews();

  const canWrite = (await fetchAdminCapabilities()).includes('admin.review.moderate');

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Avis</h1>
        <p className="notice">
          Modération des avis publiés. Un avis masqué disparaît des fiches publiques.
        </p>
      </header>
      {items.length === 0 ? (
        <EmptyState title="Aucun avis" />
      ) : (
        <DataTable
          rows={items}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'resto', header: 'Établissement', render: (row) => row.establishment_name },
            { key: 'score', header: 'Note', render: (row) => String(row.score) },
            { key: 'body', header: 'Texte', render: (row) => row.body ?? '—' },
            { key: 'status', header: 'Statut', render: (row) => row.status },
            {
              key: 'actions',
              header: '',
              render: (row) =>
                canWrite && row.status === 'PUBLISHED' ? <HideReviewButton reviewId={row.id} /> : null,
            },
          ]}
        />
      )}
    </div>
  );
}
