'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isEnvelope, isProblemDetails, unwrapEnvelope } from '@/api/envelope';
import type { OtpRequested } from '@/api/types';
import { getOrCreateInstallId } from '@/auth/install-id';
import { Button } from '@/components/button';
import { PhoneField } from '@/components/phone-field';
import { TextField } from '@/components/text-field';
import { t } from '@/i18n/messages';

type Step = 'phone' | 'code';

export function ConnexionForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function requestOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/session/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        setError(isProblemDetails(body) ? body.detail : t('states.network'));
        return;
      }

      if (!isEnvelope(body)) {
        setError(t('states.network'));
        return;
      }
      const envelope = unwrapEnvelope<OtpRequested>(body);
      setDevCode(envelope.data.devCode);
      setStep('code');
    } catch {
      setError(t('states.network'));
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/session/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code,
          device: { installId: getOrCreateInstallId(), platform: 'WEB' },
        }),
      });
      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(isProblemDetails(body) ? body.detail : t('states.network'));
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError(t('states.network'));
    } finally {
      setLoading(false);
    }
  }

  if (step === 'phone') {
    return (
      <form className="stack" onSubmit={(event) => void requestOtp(event)}>
        <PhoneField
          label={t('auth.phoneLabel')}
          name="phone"
          placeholder={t('auth.phonePlaceholder')}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        {error ? (
          <p className="field__error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={loading}>
          {t('auth.requestCode')}
        </Button>
      </form>
    );
  }

  return (
    <form className="stack" onSubmit={(event) => void verifyOtp(event)}>
      {devCode ? (
        <div className="dev-code" role="status">
          <span className="field__hint">{t('auth.devCodeNotice')}</span>
          <span className="field__label">{t('auth.devCodeLabel')}</span>
          <span className="dev-code__code">{devCode}</span>
        </div>
      ) : null}
      <TextField
        label={t('auth.codeLabel')}
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder={t('auth.codePlaceholder')}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        required
      />
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" loading={loading}>
        {t('auth.verify')}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setStep('phone');
          setCode('');
          setDevCode(undefined);
          setError(undefined);
        }}
      >
        {t('auth.backToPhone')}
      </Button>
    </form>
  );
}
