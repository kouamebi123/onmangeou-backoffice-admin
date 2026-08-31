import Link from 'next/link';

export function MetricCard({
  label,
  value,
  hint,
  href,
  actionLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <article className="card metric">
      <p className="metric__value">{value}</p>
      <p className="metric__label">{label}</p>
      {hint ? <p className="muted">{hint}</p> : null}
      {href && actionLabel ? (
        <Link className="metric__link" href={href}>
          {actionLabel}
        </Link>
      ) : null}
    </article>
  );
}
