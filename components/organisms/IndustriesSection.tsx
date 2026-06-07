import { SectionLabel } from "@/components/atoms/SectionLabel";
import { IndustryCard, type IndustryCardVariant } from "@/components/molecules/IndustryCard";
import { clsx } from "@/lib/clsx";

export interface IndustriesSectionItem {
  name: string;
  icon: React.ReactNode;
}

export interface IndustriesSectionProps {
  label?: string;
  title: string;
  industries: IndustriesSectionItem[];
  variant?: IndustryCardVariant;
  tone?: "default" | "muted";
  className?: string;
}

export function IndustriesSection({
  label = "Industries We Serve",
  title,
  industries,
  variant = "centered",
  tone = "default",
  className,
}: IndustriesSectionProps) {
  return (
    <section
      className={clsx(
        "section-pad-sm",
        tone === "muted" && "bg-[var(--bg-surface-muted)]",
        className,
      )}
    >
      <div className="container-site space-y-8">
        <div className="text-center space-y-3">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="text-h2 text-[var(--fg-primary)]">{title}</h2>
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {industries.map((ind, i) => (
            <IndustryCard
              key={`${ind.name}-${i}`}
              name={ind.name}
              icon={ind.icon}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
