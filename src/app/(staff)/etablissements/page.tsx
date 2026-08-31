import { listEstablishments } from '@/api/admin';
import { EstablishmentsList } from '@/features/establishments/establishments-list';
import { t } from '@/i18n/messages';

export default async function EstablishmentsPage() {
  const items = await listEstablishments();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>{t('establishments.title')}</h1>
      </header>
      <EstablishmentsList items={items} />
    </div>
  );
}
