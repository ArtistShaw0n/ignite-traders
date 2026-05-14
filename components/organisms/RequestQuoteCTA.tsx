import { CallUsBlock } from "@/components/molecules/CallUsBlock";
import { WhatsAppCTA } from "@/components/molecules/WhatsAppCTA";
import { clsx } from "@/lib/clsx";

export interface RequestQuoteCTAProps {
  label?: string;
  title: string;
  description: string;
  phone: string;
  whatsapp: string;
  whatsappMessage?: string;
  className?: string;
}

export function RequestQuoteCTA({
  label = "Request a Quote",
  title,
  description,
  phone,
  whatsapp,
  whatsappMessage,
  className,
}: RequestQuoteCTAProps) {
  return (
    <section
      className={clsx("section-pad-sm bg-ink-600 text-white", className)}
    >
      <div className="container-site grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-3">
          <p className="text-caption font-bold uppercase tracking-wider text-brand-400">
            {label}
          </p>
          <h2 className="text-h2 text-white tracking-tight">{title}</h2>
          <p className="text-body text-white/80 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
          <WhatsAppCTA
            phone={whatsapp}
            message={whatsappMessage}
            size="lg"
          />
          <CallUsBlock phone={phone} onDark label="Call Directly" />
        </div>
      </div>
    </section>
  );
}
