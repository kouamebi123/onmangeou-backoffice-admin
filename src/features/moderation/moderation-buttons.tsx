'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { closeTicketAction, hideReviewAction, refundOrderAction } from '@/features/moderation/actions';

export function HideReviewButton({ reviewId }: { reviewId: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="secondary"
      loading={busy}
      onClick={async () => {
        setBusy(true);
        await hideReviewAction(reviewId);
        setBusy(false);
      }}
    >
      Masquer
    </Button>
  );
}

export function RefundOrderButton({ orderId }: { orderId: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="secondary"
      loading={busy}
      onClick={async () => {
        setBusy(true);
        await refundOrderAction(orderId);
        setBusy(false);
      }}
    >
      Rembourser
    </Button>
  );
}

export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="secondary"
      loading={busy}
      onClick={async () => {
        setBusy(true);
        await closeTicketAction(ticketId);
        setBusy(false);
      }}
    >
      Clore
    </Button>
  );
}
