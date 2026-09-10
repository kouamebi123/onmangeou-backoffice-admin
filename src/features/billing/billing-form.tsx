'use client';

import { FormEvent, useState } from 'react';
import type { ModulePriceCatalog } from '@/api/admin';
import { Button } from '@/components/button';
import { TextArea, TextField } from '@/components/text-field';
import { saveModulePricesAction } from '@/features/billing/actions';
import { codeLabel, t } from '@/i18n/messages';

export function BillingForm({
  catalog,
  canWrite,
}: {
  catalog: ModulePriceCatalog;
  canWrite: boolean;
}) {
  const [notice, setNotice] = useState(catalog.notice);
  const [amounts, setAmounts] = useState<Record<string, string>>(
    Object.fromEntries(catalog.modules.map((item) => [item.code, item.monthlyPrice.amount])),
  );
  const [included, setIncluded] = useState<Record<string, boolean>>(
    Object.fromEntries(catalog.modules.map((item) => [item.code, item.included])),
  );
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(catalog.modules.map((item) => [item.code, item.enabled])),
  );
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canWrite) return;

    setLoading(true);
    setError(undefined);
    setSaved(false);

    const result = await saveModulePricesAction({
      notice,
      modules: catalog.modules.map((item) => ({
        code: item.code,
        monthlyPriceAmount: Number.parseInt(amounts[item.code] ?? '0', 10) || 0,
        included: Boolean(included[item.code]),
        enabled: Boolean(enabled[item.code]),
      })),
    });

    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? t('states.network'));
      return;
    }
    setSaved(true);
  }

  if (catalog.modules.length === 0) {
    return <p className="notice">{t('billing.empty')}</p>;
  }

  return (
    <form className="stack" onSubmit={(event) => void submit(event)}>
      {!canWrite ? <p className="notice">{t('billing.readonly')}</p> : null}
      <TextArea
        label={t('billing.noticeLabel')}
        name="notice"
        placeholder={t('billing.noticePlaceholder')}
        value={notice}
        onChange={(event) => setNotice(event.target.value)}
        maxLength={500}
        disabled={!canWrite}
      />

      {catalog.modules.map((item) => {
        const isEnabled = Boolean(enabled[item.code]);
        return (
          <div key={item.code} className="card stack">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <strong>{codeLabel('modules', item.code)}</strong>
                <p className="muted" style={{ margin: '4px 0 0' }}>
                  {isEnabled
                    ? 'Disponible pour les commerçants'
                    : 'Masquée et inutilisable pour les commerçants'}
                </p>
              </div>
              <label className="field" style={{ margin: 0 }}>
                <span className="field__label">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    disabled={!canWrite}
                    onChange={(event) =>
                      setEnabled((current) => ({
                        ...current,
                        [item.code]: event.target.checked,
                      }))
                    }
                  />{' '}
                  {isEnabled ? 'Activée' : 'Désactivée'}
                </span>
              </label>
            </div>

            <TextField
              label={t('billing.price')}
              name={`price-${item.code}`}
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={amounts[item.code] ?? '0'}
              onChange={(event) =>
                setAmounts((current) => ({ ...current, [item.code]: event.target.value }))
              }
              disabled={!canWrite || !isEnabled}
            />

            <label className="field">
              <span className="field__label">
                <input
                  type="checkbox"
                  checked={Boolean(included[item.code])}
                  disabled={!canWrite || !isEnabled}
                  onChange={(event) =>
                    setIncluded((current) => ({ ...current, [item.code]: event.target.checked }))
                  }
                />{' '}
                {t('billing.included')}
              </span>
            </label>
          </div>
        );
      })}

      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? <p className="notice">{t('billing.saved')}</p> : null}
      {canWrite ? (
        <Button type="submit" loading={loading}>
          {t('billing.save')}
        </Button>
      ) : null}
    </form>
  );
}
