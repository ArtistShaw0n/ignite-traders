import { IconBox } from "@/components/atoms/IconBox";
import { clsx } from "@/lib/clsx";

export type FeatureCardVariant = "default" | "iconed" | "editorial";

export interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  /** Required for variant="iconed". Ignored by other variants. */
  icon?: React.ReactNode;
  /**
   * - "default"   → "01" number + title + description (existing)
   * - "iconed"    → IconBox at top (using `icon` prop) + title + description
   * - "editorial" → big faded number as watermark in the background
   */
  variant?: FeatureCardVariant;
  className?: string;
}

export function FeatureCard({
  number,
  title,
  description,
  icon,
  variant = "default",
  className,
}: FeatureCardProps) {
  if (variant === "iconed") {
    return (
      <div
        className={clsx(
          "flex flex-col gap-3 p-5 sm:p-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-card hover:shadow-card-hover transition-shadow",
          className,
        )}
      >
        {icon && <IconBox icon={icon} size="md" tone="brand" />}
        <h3 className="text-h4 text-[var(--fg-primary)] mt-1">{title}</h3>
        <p className="text-body-sm text-[var(--fg-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div
        className={clsx(
          "group relative overflow-hidden flex flex-col gap-2 p-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-muted)] hover:border-brand-300 dark:hover:border-brand-500/40 transition-colors",
          className,
        )}
      >
        {/* Refined number watermark — fully inside card bounds, tracking-tight, subtle */}
        <span
          className="absolute top-4 right-5 text-[3.25rem] font-black leading-none tracking-tight select-none pointer-events-none text-brand-100 dark:text-brand-500/15"
          aria-hidden="true"
        >
          {number}
        </span>
        <div className="relative z-10 flex flex-col gap-2 pr-14">
          <h3 className="text-h4 text-[var(--fg-primary)]">{title}</h3>
          <p className="text-body-sm text-[var(--fg-secondary)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // default
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 p-5 sm:p-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-card hover:shadow-card-hover transition-shadow",
        className,
      )}
    >
      <span className="text-body-sm font-bold text-brand-500 dark:text-brand-400">
        {number}
      </span>
      <h3 className="text-h4 text-[var(--fg-primary)]">{title}</h3>
      <p className="text-body-sm text-[var(--fg-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
