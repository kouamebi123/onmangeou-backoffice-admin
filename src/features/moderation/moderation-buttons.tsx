'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { closeTicketAction, hideReviewAction, refundOrderAction } from './actions';
import { t } from '@/i18n/messages';

function ModerationButton({
  label,
  action,
}: {
  label: string;
  action: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <div>
      <Button
        variant="secondary"
        loading={busy}
        disabled={busy}
        onClick={async () => {
          if (!window.confirm(t('moderation.confirm'))) return;
          setBusy(true);
          setMessage('');
          try {
            const result = await action();
            setMessage(
              result.ok ? t('moderation.success') : (result.error ?? t('moderation.error')),
            );
          } catch {
            setMessage(t('moderation.error'));
          } finally {
            setBusy(false);
          }
        }}
      >
        {label}
      </Button>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}

export function HideReviewButton({ reviewId }: { reviewId: string }) {
  return (
    <ModerationButton label={t('moderation.hide')} action={() => hideReviewAction(reviewId)} />
  );
}
export function RefundOrderButton({ orderId }: { orderId: string }) {
  return (
    <ModerationButton label={t('moderation.refund')} action={() => refundOrderAction(orderId)} />
  );
}
export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  return (
    <ModerationButton label={t('moderation.close')} action={() => closeTicketAction(ticketId)} />
  );
}
