import { t } from '@/i18n/messages';

export function NominativeBanner() {
  return (
    <div className="banner" role="status">
      {t('app.nominativeBanner')}
    </div>
  );
}
