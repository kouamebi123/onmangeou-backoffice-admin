import { t } from '@/i18n/messages';

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="state card">
      <h2>{title}</h2>
      {body ? <p className="muted">{body}</p> : null}
    </div>
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title?: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state card" role="alert">
      <h2>{title ?? t('states.errorTitle')}</h2>
      <p className="muted">{body}</p>
      {onRetry ? (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          {t('states.retry')}
        </button>
      ) : null}
    </div>
  );
}

export function SkeletonBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="stack" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="skeleton" style={{ height: 20 }} />
      ))}
    </div>
  );
}
