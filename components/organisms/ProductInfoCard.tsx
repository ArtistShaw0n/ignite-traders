import { Badge } from "@/components/atoms/Badge";
import { CallUsBlock } from "@/components/molecules/CallUsBlock";
import { WhatsAppCTA } from "@/components/molecules/WhatsAppCTA";
import { ProductSpecRow, type ProductSpecRowProps } from "@/components/molecules/ProductSpecRow";
import { clsx } from "@/lib/clsx";

export interface ProductInfoCardProps {
  category: string;
  title: string;
  description: string;
  specs: Array<Pick<ProductSpecRowProps, "label" | "value" | "highlight">>;
  phone: string;
  whatsapp: string;
  whatsappLabel?: string;
  className?: string;
}

export function ProductInfoCard({
  category,
  title,
  description,
  specs,
  phone,
  whatsapp,
  whatsappLabel = "Chat now",
  className,
}: ProductInfoCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-[var(--bg-surface-muted)] p-6 sm:p-8 lg:p-10 space-y-6",
        className,
      )}
    >
      <div className="space-y-4">
        <Badge color="bestseller" variant="soft" placement="inline">
          {category}
        </Badge>
        <h1 className="text-h2 text-[var(--fg-primary)] tracking-tight">{title}</h1>
        <p className="text-body text-[var(--fg-secondary)] leading-relaxed">{description}</p>
      </div>

      <dl className="space-y-0 border-y border-[var(--border-default)] py-2">
        {specs.map((s, i) => (
          <ProductSpecRow key={i} {...s} />
        ))}
      </dl>

      <div className="flex items-center gap-3 flex-wrap pt-2">
        <CallUsBlock phone={phone} />
        <WhatsAppCTA phone={whatsapp} label={whatsappLabel} />
      </div>
    </div>
  );
}
