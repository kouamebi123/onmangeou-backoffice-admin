'use client';

import { FormEvent, useState } from 'react';
import type { ModulePriceCatalog } from '@/api/admin';
import { Button } from '@/components/button';
import { TextArea } from '@/components/text-field';
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
  const [dirty, setDirty] = useState(false);
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
    setDirty(false);
    setSaved(true);
  }

  if (catalog.modules.length === 0) {
    return <p className="notice">{t('billing.empty')}</p>;
  }

  const enabledCount = catalog.modules.filter((item) => Boolean(enabled[item.code])).length;
  const summary = t('billing.summary')
    .replace('{enabled}', String(enabledCount))
    .replace('{total}', String(catalog.modules.length));
  const markDirty = () => {
    setSaved(false);
    setDirty(true);
  };

  return (
    <form className="stack" onSubmit={(event) => void submit(event)}>
      {!canWrite ? <p className="notice">{t('billing.readonly')}</p> : null}
      <TextArea
        label={t('billing.noticeLabel')}
        name="notice"
        placeholder={t('billing.noticePlaceholder')}
        value={notice}
        onChange={(event) => {
          setNotice(event.target.value);
          markDirty();
        }}
        maxLength={500}
        disabled={!canWrite}
      />

      <div className="card billing">
        <p className="billing__summary">{summary}</p>
        <div className="table-wrap">
          <table className="table billing__table">
            <thead>
              <tr>
                <th scope="col">{t('billing.module')}</th>
                <th scope="col">{t('billing.availability')}</th>
                <th scope="col">{t('billing.included')}</th>
                <th scope="col" className="billing__price-head">
                  {t('billing.price')}
                </th>
              </tr>
            </thead>
            <tbody>
              {catalog.modules.map((item) => {
                const isEnabled = Boolean(enabled[item.code]);
                const label = codeLabel('modules', item.code);
                return (
                  <tr key={item.code} className={isEnabled ? undefined : 'billing__row--off'}>
                    <th scope="row">
                      <span className="billing__name">{label}</span>
                      {isEnabled ? null : (
                        <span className="billing__hint">{t('billing.disabledHint')}</span>
                      )}
                    </th>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          role="switch"
                          checked={isEnabled}
                          disabled={!canWrite}
                          onChange={(event) => {
                            setEnabled((current) => ({
                              ...current,
                              [item.code]: event.target.checked,
                            }));
                            markDirty();
                          }}
                        />
                        <span className="switch__track" aria-hidden="true" />
                        <span className="switch__label">
                          {isEnabled ? t('billing.enabled') : t('billing.disabled')}
                        </span>
                      </label>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="billing__check"
                        aria-label={`${t('billing.included')} — ${label}`}
                        checked={Boolean(included[item.code])}
                        disabled={!canWrite || !isEnabled}
                        onChange={(event) => {
                          setIncluded((current) => ({
                            ...current,
                            [item.code]: event.target.checked,
                          }));
                          markDirty();
                        }}
                      />
                    </td>
                    <td className="billing__price">
                      <input
                        className="field__input"
                        name={`price-${item.code}`}
                        aria-label={`${t('billing.price')} — ${label}`}
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        value={amounts[item.code] ?? '0'}
                        onChange={(event) => {
                          setAmounts((current) => ({
                            ...current,
                            [item.code]: event.target.value,
                          }));
                          markDirty();
                        }}
                        disabled={!canWrite || !isEnabled}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
      {canWrite ? (
        <div className="billing__actions">
          <Button type="submit" loading={loading}>
            {t('billing.save')}
          </Button>
          {saved ? (
            <p className="notice" role="status">
              {t('billing.saved')}
            </p>
          ) : dirty ? (
            <p className="notice">{t('billing.unsaved')}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
