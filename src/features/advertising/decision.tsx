'use client';
import { useState } from 'react';
import { Button } from '@/components/button';
import { TextArea } from '@/components/text-field';
import { t } from '@/i18n/messages';
import { decideCampaign } from './actions';
export function CampaignDecision({ id }: { id: string }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(status: string) {
    if (!window.confirm(t('moderation.confirm'))) return;
    setBusy(true);
    try {
      setMessage((await decideCampaign(id, status, reason.trim())).message);
    } catch {
      setMessage(t('moderation.error'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stack">
      <TextArea
        id={`campaign-${id}`}
        label={t('ads.reason')}
        value={reason}
        maxLength={1000}
        disabled={busy}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="stack">
        <Button disabled={busy || reason.trim().length < 3} onClick={() => void submit('APPROVED')}>
          {t('ads.approve')}
        </Button>
        <Button disabled={busy || reason.trim().length < 3} onClick={() => void submit('REJECTED')}>
          {t('ads.reject')}
        </Button>
        <Button disabled={busy || reason.trim().length < 3} onClick={() => void submit('PAUSED')}>
          {t('ads.pause')}
        </Button>
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
