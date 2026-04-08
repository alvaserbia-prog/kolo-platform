import Link from "next/link";

interface Props {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
}

function DefaultIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function EmptyState({ title, description, ctaLabel, ctaHref, icon }: Props) {
  return (
    <div className="bg-kolo-surface rounded-2xl card-shadow p-10 flex flex-col items-center text-center gap-3">
      <div className="text-kolo-green-500">
        {icon ?? <DefaultIcon />}
      </div>
      <p className="text-sm font-semibold text-kolo-text">{title}</p>
      {description && (
        <p className="text-sm text-kolo-muted max-w-xs">{description}</p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-1 px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
