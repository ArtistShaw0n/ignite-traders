import { clsx } from "@/lib/clsx";

export interface ProductSpecRowProps {
  label: string;
  value: React.ReactNode;
  /** Highlight value in success-green (used for "Available — MOQ on request"). */
  highlight?: boolean;
  className?: string;
}

export function ProductSpecRow({
  label,
  value,
  highlight = false,
  className,
}: ProductSpecRowProps) {
  return (
    <div
      className={clsx(
        "grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] items-start gap-3 sm:gap-4 py-2.5",
        className,
      )}
    >
      <dt className="text-body-sm text-[var(--fg-muted)]">{label}</dt>
      <dd
        className={clsx(
          "text-body-sm font-semibold",
          highlight ? "text-success-600 dark:text-success-400" : "text-[var(--fg-primary)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
