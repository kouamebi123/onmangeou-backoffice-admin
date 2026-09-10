'use client';

import { useState } from 'react';
import { ConfirmationAction } from '@/components/confirmation-action';
import { TextArea } from '@/components/text-field';
import { t } from '@/i18n/messages';
import { resolveReviewReport } from './report-actions';

export function ReportDecision({ id }: { id: string }) {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  async function submit(status: 'ACTIONED' | 'DISMISSED') {
    setMessage('');
    try {
      const result = await resolveReviewReport(id, status, reason.trim());
      setMessage(result.ok ? t('moderation.success') : (result.error ?? t('moderation.error')));
    } catch {
      setMessage(t('moderation.error'));
    }
  }

  const disabled = reason.trim().length < 3;

  return (
    <div className="stack">
      <TextArea
        id={`resolution-${id}`}
        label={t('reviewReports.resolution')}
        value={reason}
        maxLength={1000}
        onChange={(event) => setReason(event.target.value)}
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <ConfirmationAction
          triggerLabel={t('reviewReports.dismiss')}
          triggerVariant="secondary"
          confirmVariant="secondary"
          confirmLabel="Confirmer le classement"
          disabled={disabled}
          description="Le signalement sera classé sans masquer l’avis."
          onConfirm={() => submit('DISMISSED')}
        />
        <ConfirmationAction
          triggerLabel={t('reviewReports.hide')}
          confirmLabel="Confirmer le masquage"
          disabled={disabled}
          description="L’avis sera masqué et le signalement sera marqué comme traité."
          onConfirm={() => submit('ACTIONED')}
        />
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
