import { statusLabel } from '@/i18n/messages';

type Tone = 'neutral' | 'success' | 'danger' | 'warning';

const TONES: Record<string, Tone> = {
  OPEN: 'warning',
  IN_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  PUBLISHED: 'success',
  SUSPENDED: 'danger',
  CLOSED: 'neutral',
  DRAFT: 'neutral',
  PENDING_VERIFICATION: 'warning',
};

export function StatusChip({ status }: { status: string }) {
  const tone = TONES[status] ?? 'neutral';
  const className = tone === 'neutral' ? 'chip' : `chip chip--${tone}`;
  return <span className={className}>{statusLabel(status)}</span>;
}
