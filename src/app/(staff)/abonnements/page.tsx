import { fetchModulePrices } from '@/api/admin';
import { requireStaff } from '@/auth/session';
import { BillingForm } from '@/features/billing/billing-form';
import { t } from '@/i18n/messages';

export default async function BillingPage() {
  const [me, catalog] = await Promise.all([requireStaff(), fetchModulePrices()]);

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('billing.title')}</h1>
        <p className="muted">{t('billing.intro')}</p>
      </header>
      <BillingForm catalog={catalog} canWrite={me.platformRole === 'ADMIN'} />
    </div>
  );
}
