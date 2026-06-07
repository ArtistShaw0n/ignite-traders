import { Plus } from "lucide-react";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { clsx } from "@/lib/clsx";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  label?: string;
  title: string;
  description?: string;
  items: FaqItem[];
  tone?: "default" | "muted";
  defaultOpenIndex?: number;
  /** DOM id for anchor links (e.g. /#faq from the header). */
  id?: string;
  className?: string;
}

export function FaqSection({
  label = "FAQ",
  title,
  description,
  items,
  tone = "default",
  defaultOpenIndex = 0,
  id = "faq",
  className,
}: FaqSectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "section-pad-sm scroll-mt-24",
        tone === "muted" && "bg-[var(--bg-surface-muted)]",
        className,
      )}
    >
      <div className="container-site space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="text-h2 text-[var(--fg-primary)]">{title}</h2>
          {description && <p className="text-body text-[var(--fg-secondary)]">{description}</p>}
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, i) => (
            <details
              key={`${item.question}-${i}`}
              open={i === defaultOpenIndex}
              className="group rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] open:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                <span className="text-base sm:text-lg font-semibold text-[var(--fg-primary)]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-surface-muted)] text-[var(--fg-secondary)] transition-transform duration-200 group-open:rotate-45 group-open:bg-brand-500 group-open:text-[var(--fg-on-brand)]"
                >
                  <Plus size={18} />
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1">
                <p className="text-body text-[var(--fg-secondary)] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
