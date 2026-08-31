export const DISPLAY_TIME_ZONE = 'Africa/Abidjan';

const formatter = new Intl.DateTimeFormat('fr-CI', {
  timeZone: DISPLAY_TIME_ZONE,
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return formatter.format(date);
}
