import { Button } from "@/components/atoms/Button";
import { clsx } from "@/lib/clsx";
import { SITE_WHATSAPP } from "@/lib/site";

export interface BulkQuoteCTAProps {
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}

export function BulkQuoteCTA({
  title = "Need bulk quantities or custom items?",
  description = "Our procurement team handles RFQs, custom sourcing, and bulk pricing negotiations.",
  cta = {
    label: "Request bulk quote",
    href: `https://wa.me/${SITE_WHATSAPP}?text=${encodeURIComponent("Hi! I'd like a bulk quote.")}`,
  },
  className,
}: BulkQuoteCTAProps) {
  return (
    <section className={clsx("section-pad-sm bg-ink-900 text-white text-center", className)}>
      <div className="container-site space-y-4 max-w-3xl mx-auto">
        <h2 className="text-h2 text-white tracking-tight">{title}</h2>
        <p className="text-body text-white/80 leading-relaxed">{description}</p>
        <div className="pt-2">
          <Button href={cta.href} variant="primary" size="lg">
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
