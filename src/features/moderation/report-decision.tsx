'use client';
import { useState } from 'react';
import { Button } from '@/components/button';
import { TextArea } from '@/components/text-field';
import { t } from '@/i18n/messages';
import { resolveReviewReport } from './report-actions';
export function ReportDecision({ id }: { id: string }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(status: 'ACTIONED' | 'DISMISSED') {
    if (!window.confirm(t('moderation.confirm'))) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await resolveReviewReport(id, status, reason.trim());
      setMessage(result.ok ? t('moderation.success') : (result.error ?? t('moderation.error')));
    } catch {
      setMessage(t('moderation.error'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stack">
      <TextArea
        id={`resolution-${id}`}
        label={t('reviewReports.resolution')}
        value={reason}
        maxLength={1000}
        disabled={busy}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button
        variant="secondary"
        disabled={busy || reason.trim().length < 3}
        onClick={() => void submit('DISMISSED')}
      >
        {t('reviewReports.dismiss')}
      </Button>
      <Button disabled={busy || reason.trim().length < 3} onClick={() => void submit('ACTIONED')}>
        {t('reviewReports.hide')}
      </Button>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
