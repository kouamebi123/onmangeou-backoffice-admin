'use client';

import { useState } from 'react';
import type { VerificationCase } from '@/api/types';
import { formatDateTime } from '@/api/format';
import { Button } from '@/components/button';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/feedback';
import { StatusChip } from '@/components/status-chip';
import { DecisionForm } from '@/features/verification/decision-form';
import { t } from '@/i18n/messages';

export function VerificationList({
  items,
  canDecide,
}: {
  items: VerificationCase[];
  canDecide: boolean;
}) {
  const [selected, setSelected] = useState<VerificationCase | null>(null);

  if (items.length === 0) {
    return <EmptyState title={t('verification.empty')} />;
  }

  return (
    <div className="stack">
      <DataTable
        rows={items}
        getRowKey={(row) => row.id}
        columns={[
          {
            key: 'organization',
            header: t('verification.organization'),
            render: (row) => row.organizationName,
          },
          {
            key: 'establishment',
            header: t('verification.establishment'),
            render: (row) => row.establishmentName ?? '—',
          },
          {
            key: 'submittedAt',
            header: t('verification.submittedAt'),
            render: (row) => formatDateTime(row.submittedAt),
          },
          {
            key: 'status',
            header: t('verification.status'),
            render: (row) => <StatusChip status={row.status} />,
          },
          {
            key: 'actions',
            header: '',
            render: (row) =>
              canDecide && (row.status === 'OPEN' || row.status === 'IN_REVIEW') ? (
                <Button variant="secondary" onClick={() => setSelected(row)}>
                  {t('verification.decide')}
                </Button>
              ) : null,
          },
        ]}
      />
      {selected ? <DecisionForm item={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
