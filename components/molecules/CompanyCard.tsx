import { clsx } from "@/lib/clsx";

type LogoOnlyVariant = {
  variant: "logo";
  logo: React.ReactNode;
  alt?: string;
};
type StackedVariant = {
  variant: "stacked";
  logo: React.ReactNode;
  name: string;
  alt?: string;
};
type InitialsVariant = {
  variant: "initials";
  initials: string;
  name: string;
};

export type CompanyCardProps = (LogoOnlyVariant | StackedVariant | InitialsVariant) & {
  className?: string;
};

export function CompanyCard(props: CompanyCardProps) {
  const baseCard = clsx(
    "rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors",
    props.className,
  );

  // Logo only — horizontal, centered logo, no name
  if (props.variant === "logo") {
    return (
      <div
        className={clsx(
          baseCard,
          "flex items-center justify-center p-5 min-h-[80px] hover:border-[var(--border-strong)]",
        )}
        aria-label={props.alt}
      >
        {props.logo}
      </div>
    );
  }

  // Stacked — logo on top, name on bottom (vertical)
  if (props.variant === "stacked") {
    return (
      <div
        className={clsx(
          baseCard,
          "flex flex-col items-center justify-center gap-3 p-5 min-h-[120px] hover:border-[var(--border-strong)]",
        )}
        aria-label={props.alt}
      >
        <div className="flex-1 flex items-center justify-center">{props.logo}</div>
        <p className="text-body-sm font-medium text-[var(--fg-primary)] text-center leading-snug">
          {props.name}
        </p>
      </div>
    );
  }

  // Initials — small initials badge + name (horizontal)
  return (
    <div
      className={clsx(
        baseCard,
        "flex items-center gap-3 p-4 min-h-[64px] hover:border-[var(--border-strong)]",
      )}
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 text-body-sm font-bold flex-shrink-0">
        {props.initials}
      </span>
      <p className="text-body-sm font-medium text-[var(--fg-primary)] flex-1 min-w-0 truncate">
        {props.name}
      </p>
    </div>
  );
}
