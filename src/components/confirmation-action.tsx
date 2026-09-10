'use client';

import { useState } from 'react';
import { Button } from '@/components/button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

export function ConfirmationAction({
  triggerLabel,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  title = 'Confirmer cette action',
  description,
  triggerVariant = 'secondary',
  confirmVariant = 'destructive',
  disabled = false,
  onConfirm,
}: {
  triggerLabel: string;
  confirmLabel?: string;
  cancelLabel?: string;
  title?: string;
  description?: string;
  triggerVariant?: ButtonVariant;
  confirmVariant?: ButtonVariant;
  disabled?: boolean;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button variant={triggerVariant} disabled={disabled} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
    );
  }

  return (
    <div
      role="group"
      aria-label={title}
      style={{
        display: 'grid',
        gap: 10,
        padding: 14,
        border: '1px solid var(--border, #d8e2df)',
        borderRadius: 12,
        background: 'var(--surface, #fff)',
        boxShadow: '0 8px 24px rgba(20, 63, 56, 0.10)',
        minWidth: 260,
      }}
    >
      <strong>{title}</strong>
      {description ? <span className="muted">{description}</span> : null}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant={confirmVariant} loading={busy} disabled={busy} onClick={() => void confirm()}>
          {confirmLabel}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => setOpen(false)}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
