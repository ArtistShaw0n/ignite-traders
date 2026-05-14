import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import {
  ProductCard,
  type ProductCardProps,
} from "@/components/molecules/ProductCard";
import { clsx } from "@/lib/clsx";

export interface ProductGridSectionProps {
  label?: string;
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  products: ProductCardProps[];
  /** Background tone — "default" or "muted" (alt section bg). */
  tone?: "default" | "muted";
  className?: string;
}

export function ProductGridSection({
  label,
  title,
  seeAllHref,
  seeAllLabel = "See All",
  products,
  tone = "default",
  className,
}: ProductGridSectionProps) {
  return (
    <section
      className={clsx(
        "section-pad-sm",
        tone === "muted" && "bg-[var(--bg-surface-muted)]",
        className,
      )}
    >
      <div className="container-site space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            {label && <SectionLabel>{label}</SectionLabel>}
            <h2 className="text-h2 text-[var(--fg-primary)]">{title}</h2>
          </div>
          {seeAllHref && (
            <ArrowLink href={seeAllHref}>{seeAllLabel}</ArrowLink>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={`${p.title}-${i}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
