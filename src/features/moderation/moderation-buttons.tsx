'use client';

import { useState } from 'react';
import { ConfirmationAction } from '@/components/confirmation-action';
import { closeTicketAction, hideReviewAction, refundOrderAction } from './actions';
import { t } from '@/i18n/messages';

function ModerationButton({
  label,
  confirmLabel,
  description,
  action,
}: {
  label: string;
  confirmLabel: string;
  description: string;
  action: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [message, setMessage] = useState('');

  return (
    <div className="stack">
      <ConfirmationAction
        triggerLabel={label}
        confirmLabel={confirmLabel}
        description={description}
        onConfirm={async () => {
          setMessage('');
          try {
            const result = await action();
            setMessage(
              result.ok ? t('moderation.success') : (result.error ?? t('moderation.error')),
            );
          } catch {
            setMessage(t('moderation.error'));
          }
        }}
      />
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}

export function HideReviewButton({ reviewId }: { reviewId: string }) {
  return (
    <ModerationButton
      label={t('moderation.hide')}
      confirmLabel="Confirmer le masquage"
      description="L’avis sera masqué après votre confirmation."
      action={() => hideReviewAction(reviewId)}
    />
  );
}

export function RefundOrderButton({ orderId }: { orderId: string }) {
  return (
    <ModerationButton
      label={t('moderation.refund')}
      confirmLabel="Confirmer le remboursement"
      description="Confirmez le remboursement de cette commande. Cette action sera journalisée."
      action={() => refundOrderAction(orderId)}
    />
  );
}

export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  return (
    <ModerationButton
      label={t('moderation.close')}
      confirmLabel="Confirmer la clôture"
      description="Le ticket sera clôturé après votre confirmation."
      action={() => closeTicketAction(ticketId)}
    />
  );
}
