import { Button } from "@/components/atoms/Button";
import { CountdownTimer } from "@/components/molecules/CountdownTimer";
import { clsx } from "@/lib/clsx";

export interface BulkOfferBannerProps {
  title: string;
  description: string;
  cta: { label: string; href: string };
  targetDate: Date | string;
  tone?: "default" | "muted";
  className?: string;
}

export function BulkOfferBanner({
  title,
  description,
  cta,
  targetDate,
  tone = "default",
  className,
}: BulkOfferBannerProps) {
  return (
    <section
      className={clsx(
        "section-pad-sm",
        tone === "muted" && "bg-[var(--bg-surface-muted)]",
        className,
      )}
    >
      <div className="container-site">
        <div className="rounded-xl bg-brand-500 text-white px-6 py-6 sm:px-8 sm:py-8 lg:px-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          <div className="flex-1 space-y-3">
            <h2 className="text-h2 font-bold">{title}</h2>
            <p className="text-body text-white/85 max-w-xl leading-relaxed">{description}</p>
            <div className="pt-1">
              <Button
                href={cta.href}
                variant="primary"
                size="md"
                className="!bg-white !text-brand-600 hover:!bg-white/90 hover:!text-brand-700"
              >
                {cta.label}
              </Button>
            </div>
          </div>
          <div className="lg:flex-shrink-0">
            <CountdownTimer targetDate={targetDate} tone="onBrand" />
          </div>
        </div>
      </div>
    </section>
  );
}
