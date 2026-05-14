import { clsx } from "@/lib/clsx";

export interface FilterPillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function FilterPill({
  active = false,
  className,
  children,
  type = "button",
  ...rest
}: FilterPillProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={clsx(
        // Always include `border border-transparent` (or coloured) so the box
        // model stays constant between active/inactive — prevents the row of
        // pills from shifting by 1–2px on each click.
        "inline-flex items-center justify-center px-4 py-2 rounded-pill border text-body-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        active
          ? "bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600"
          : "bg-[var(--bg-surface-muted)] text-[var(--fg-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-surface)] hover:text-[var(--fg-primary)]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
