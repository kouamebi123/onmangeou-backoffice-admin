'use client';

import { useState } from 'react';
import { ConfirmationAction } from '@/components/confirmation-action';
import { TextArea } from '@/components/text-field';
import { t } from '@/i18n/messages';
import { decideCampaign } from './actions';

export function CampaignDecision({ id }: { id: string }) {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  async function submit(status: string) {
    try {
      setMessage((await decideCampaign(id, status, reason.trim())).message);
    } catch {
      setMessage(t('moderation.error'));
    }
  }

  const disabled = reason.trim().length < 3;

  return (
    <div className="stack">
      <TextArea
        id={`campaign-${id}`}
        label={t('ads.reason')}
        value={reason}
        maxLength={1000}
        onChange={(event) => setReason(event.target.value)}
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <ConfirmationAction
          triggerLabel={t('ads.approve')}
          confirmLabel="Confirmer l’approbation"
          confirmVariant="primary"
          disabled={disabled}
          description="La campagne deviendra visible selon sa période de diffusion."
          onConfirm={() => submit('APPROVED')}
        />
        <ConfirmationAction
          triggerLabel={t('ads.reject')}
          confirmLabel="Confirmer le refus"
          disabled={disabled}
          description="La campagne sera refusée avec le motif saisi."
          onConfirm={() => submit('REJECTED')}
        />
        <ConfirmationAction
          triggerLabel={t('ads.pause')}
          confirmLabel="Confirmer la suspension"
          disabled={disabled}
          description="La diffusion de la campagne sera suspendue."
          onConfirm={() => submit('PAUSED')}
        />
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
