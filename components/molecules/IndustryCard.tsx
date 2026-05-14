import { IconBox } from "@/components/atoms/IconBox";
import { clsx } from "@/lib/clsx";

export type IndustryCardVariant = "default" | "centered" | "minimal";

export interface IndustryCardProps {
  name: string;
  icon: React.ReactNode;
  /**
   * - "default"  → IconBox + text, left-aligned (existing)
   * - "centered" → IconBox + text, both center-aligned
   * - "minimal"  → soft brand-tinted card, no border/shadow, larger icon, hover lift
   */
  variant?: IndustryCardVariant;
  className?: string;
}

export function IndustryCard({
  name,
  icon,
  variant = "default",
  className,
}: IndustryCardProps) {
  if (variant === "centered") {
    return (
      <div
        className={clsx(
          "flex flex-col items-center text-center gap-3 p-5 sm:p-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-card hover:shadow-card-hover transition-shadow",
          className,
        )}
      >
        <IconBox icon={icon} size="md" tone="brand" />
        <p className="text-body font-semibold text-[var(--fg-primary)] leading-snug">
          {name}
        </p>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={clsx(
          "group flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/15 hover:-translate-y-0.5 transition-all duration-200",
          className,
        )}
      >
        <span className="text-brand-500 dark:text-brand-400 transition-transform group-hover:scale-110">
          {icon}
        </span>
        <p className="text-body font-semibold text-[var(--fg-primary)] leading-snug">
          {name}
        </p>
      </div>
    );
  }

  // default — left-aligned
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-3 p-5 sm:p-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-card hover:shadow-card-hover transition-shadow",
        className,
      )}
    >
      <IconBox icon={icon} size="md" tone="brand" />
      <p className="text-body font-semibold text-[var(--fg-primary)] leading-snug">
        {name}
      </p>
    </div>
  );
}
