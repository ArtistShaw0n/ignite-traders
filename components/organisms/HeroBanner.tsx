import { Button } from "@/components/atoms/Button";
import { clsx } from "@/lib/clsx";

export interface HeroBannerProps {
  badge?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

/**
 * HeroBanner spec (matches Figma):
 * - Desktop: 1232 × 400 (min-height 400px), padding 56 horizontal × 32 vertical, rounded 24px
 * - Mobile / tablet: responsive padding, content-driven height
 */
export function HeroBanner({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: HeroBannerProps) {
  return (
    <section className={clsx("section-pad-sm container-site", className)}>
      <div className="relative overflow-hidden rounded-xl bg-ink-900 text-white px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-8 lg:min-h-[400px] flex items-center">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center w-full">
          {/* Text */}
          <div className="space-y-4">
            {badge && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-pill bg-white/10 text-white text-caption font-bold uppercase tracking-wider border border-white/15">
                + {badge}
              </span>
            )}
            <h1 className="text-h1 tracking-tight font-bold leading-[1.1]">
              {title}
            </h1>
            <p className="text-body text-white/80 leading-relaxed max-w-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {primaryCta && (
                <Button href={primaryCta.href} variant="primary" size="md">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  href={secondaryCta.href}
                  variant="secondary"
                  size="md"
                  className="!bg-white !text-ink-900 !border-white hover:!bg-white/90"
                >
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          </div>

          {/* Right-side illustration placeholder */}
          <div className="hidden lg:block">
            <div className="aspect-square w-full max-w-[280px] ml-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShirtIcon />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShirtIcon() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-1/2 h-1/2 text-white/30"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M70 40 L100 50 L130 40 L155 60 L150 80 L130 75 L130 160 L70 160 L70 75 L50 80 L45 60 Z" />
    </svg>
  );
}
