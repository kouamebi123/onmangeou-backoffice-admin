'use client';

import { ErrorState } from '@/components/feedback';
import { t } from '@/i18n/messages';

export default function StaffError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState title={t('states.errorTitle')} body={error.message} onRetry={reset} />;
}
