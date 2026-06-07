import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { clsx } from "@/lib/clsx";

export interface ProductCardProps {
  title: string;
  category: string;
  sizes: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  badge?: {
    color: BadgeColor;
    label: string;
  };
  className?: string;
}

/**
 * ProductCard — design specs:
 * - Card:   290 × 412, radius 12, white bg, subtle border, padding p-2.5 (10px) for cover area
 * - Cover:  270 × 267 (~1:1 aspect), radius 12, neutral-50 bg, sits inside card with 10px inset
 * - Image:  transparent inside cover, object-contain so it preserves aspect ratio
 * - Badge:  corner-tl placement — clipped by cover's rounded corner
 */
export function ProductCard({
  title,
  category,
  sizes,
  href,
  image,
  imageAlt,
  badge,
  className,
}: ProductCardProps) {
  const cardClasses = clsx(
    "group flex flex-col overflow-hidden rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-card hover:shadow-card-hover transition-shadow",
    className,
  );

  const inner = (
    <>
      {/* Cover wrapper — 10px padding around the cover */}
      <div className="p-2.5">
        {/* Cover — the rounded grey container */}
        <div className="relative aspect-[270/267] bg-[var(--bg-surface-muted)] rounded-md overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <ProductImagePlaceholder />
          )}
          {badge && (
            <Badge
              color={badge.color}
              variant="soft"
              placement="corner-tl"
              className="absolute top-0 left-0"
            >
              {badge.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Body — content area below the cover */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
          {category}
        </p>
        {/*
          Title reserves 2 lines of vertical space (min-h-[2.75em] = 2 × leading-snug
          line-height). So 1-line titles and 2-line titles produce identical card
          heights, keeping Sizes / divider / Details aligned across all cards in a row.
          line-clamp-2 truncates with "…" if title exceeds 2 lines.
        */}
        <h3 className="mt-2 text-lg font-bold leading-snug text-[var(--fg-primary)] line-clamp-2 min-h-[2.75em]">
          {title}
        </h3>
        <p className="mt-1.5 text-body-sm text-[var(--fg-secondary)]">Sizes: {sizes}</p>

        <div className="mt-4 pt-4 border-t border-[var(--border-muted)] flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-body font-bold text-brand-500 group-hover:text-brand-600 dark:text-brand-400 dark:group-hover:text-brand-300 transition-colors">
            Details
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses} aria-label={title}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClasses}>{inner}</div>;
}

/**
 * Visual placeholder shown when a product has no image. Stylised silhouette of
 * a hooded coverall — matches IGNITE's pharma-protective-wear focus.
 */
function ProductImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <svg
        viewBox="0 0 200 240"
        fill="currentColor"
        className="w-3/5 h-auto text-[var(--fg-muted)] opacity-50"
        aria-hidden="true"
      >
        {/* Hood */}
        <ellipse cx="100" cy="40" rx="28" ry="32" />
        {/* Coverall body — shoulders extending to sleeve stubs, straight torso */}
        <path d="M74 72 L126 72 L162 92 Q170 96 168 108 L162 126 L150 130 L150 232 L50 232 L50 130 L38 126 L32 108 Q30 96 38 92 Z" />
      </svg>
    </div>
  );
}
