import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CallUsBlock } from "@/components/molecules/CallUsBlock";
import { WhatsAppCTA } from "@/components/molecules/WhatsAppCTA";
import { clsx } from "@/lib/clsx";

export interface ContactCardProps {
  label?: string;
  title?: string;
  description?: string;
  phone: string;
  whatsapp: string;
  whatsappMessage?: string;
  className?: string;
}

export function ContactCard({
  label = "Urgent?",
  title = "Reach us directly",
  description = "For time-sensitive inquiries, call or WhatsApp us — we're available during business hours.",
  phone,
  whatsapp,
  whatsappMessage,
  className,
}: ContactCardProps) {
  return (
    <section className={clsx("section-pad-sm", className)}>
      <div className="container-site">
        <div className="max-w-2xl space-y-5">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="text-h2 text-[var(--fg-primary)] tracking-tight">{title}</h2>
          <p className="text-body text-[var(--fg-secondary)] leading-relaxed">{description}</p>
          <div className="flex items-center gap-4 flex-wrap pt-2">
            <CallUsBlock phone={phone} />
            <WhatsAppCTA phone={whatsapp} message={whatsappMessage} size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}
