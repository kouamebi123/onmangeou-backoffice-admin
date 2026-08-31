import { SkeletonBlock } from '@/components/feedback';
import { t } from '@/i18n/messages';

export default function StaffLoading() {
  return (
    <div className="stack">
      <p className="muted">{t('states.loading')}</p>
      <SkeletonBlock rows={6} />
    </div>
  );
}
