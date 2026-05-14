import { SectionLabel } from "@/components/atoms/SectionLabel";
import {
  FeatureCard,
  type FeatureCardVariant,
} from "@/components/molecules/FeatureCard";
import { clsx } from "@/lib/clsx";

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface WhyChooseSectionProps {
  label?: string;
  title: string;
  features: WhyChooseItem[];
  variant?: FeatureCardVariant;
  tone?: "default" | "muted";
  className?: string;
}

export function WhyChooseSection({
  label = "Why Choose Ignite",
  title,
  features,
  variant = "default",
  tone = "default",
  className,
}: WhyChooseSectionProps) {
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={`${f.number}-${i}`}
              number={f.number}
              title={f.title}
              description={f.description}
              icon={f.icon}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
