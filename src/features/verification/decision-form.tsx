'use client';

import { FormEvent, useState } from 'react';
import type { VerificationCase } from '@/api/types';
import { Button } from '@/components/button';
import { TextArea } from '@/components/text-field';
import { decideVerificationAction } from '@/features/verification/actions';
import { t } from '@/i18n/messages';

export function DecisionForm({ item, onClose }: { item: VerificationCase; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | null>(null);

  async function submit(event: FormEvent, decision: 'APPROVED' | 'REJECTED') {
    event.preventDefault();
    setLoading(decision);
    setError(undefined);

    const result = await decideVerificationAction(item.id, decision, reason);
    if (!result.ok) {
      setError(result.error ?? t('states.network'));
      setLoading(null);
      return;
    }

    onClose();
  }

  return (
    <form className="stack card">
      <p>
        {item.organizationName}
        {item.establishmentName ? ` - ${item.establishmentName}` : ''}
      </p>
      <TextArea
        label={t('verification.reasonLabel')}
        name="reason"
        placeholder={t('verification.reasonPlaceholder')}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        required
        maxLength={1000}
        error={error}
      />
      <div className="stack" style={{ flexDirection: 'row', display: 'flex', gap: 12 }}>
        <Button
          type="submit"
          loading={loading === 'APPROVED'}
          onClick={(event) => void submit(event, 'APPROVED')}
        >
          {t('verification.approve')}
        </Button>
        <Button
          type="submit"
          variant="destructive"
          loading={loading === 'REJECTED'}
          onClick={(event) => void submit(event, 'REJECTED')}
        >
          {t('verification.reject')}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          {t('verification.cancel')}
        </Button>
      </div>
    </form>
  );
}
