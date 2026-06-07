import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CompanyCard, type CompanyCardProps } from "@/components/molecules/CompanyCard";
import { clsx } from "@/lib/clsx";

export interface TrustedCompaniesSectionProps {
  label?: string;
  title: string;
  /** Companies are split into two rows automatically — logos in first row, initials in second. */
  companies: CompanyCardProps[];
  tone?: "default" | "muted";
  className?: string;
}

export function TrustedCompaniesSection({
  label = "Companies We've Served",
  title,
  companies,
  tone = "default",
  className,
}: TrustedCompaniesSectionProps) {
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c, i) => (
            <CompanyCard key={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
