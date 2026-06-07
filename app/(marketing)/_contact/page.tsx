import type { Metadata } from "next";
import { ContactCard, ContactForm, PageHeader } from "@/components/organisms";
import { SITE_PHONE_ALT, SITE_WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send us your inquiry — bulk quotes, product questions, or partnership conversations. Our procurement team responds within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact IGNITE"
        description="Send us your inquiry — bulk quotes, product questions, or partnership conversations. Our procurement team responds within 24 hours."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />
      <ContactCard
        phone={SITE_PHONE_ALT}
        whatsapp={SITE_WHATSAPP}
        whatsappMessage="Hi! I'd like to inquire about your products."
      />
      <section className="container-site section-pad-sm">
        <div className="max-w-2xl">
          <h2 className="text-h2 font-bold tracking-tight">Send us a written inquiry</h2>
          <p className="mt-2 text-body text-[var(--fg-muted)]">
            Prefer to write? Share what you need and our team will reply with a quote, lead time,
            and any clarifications.
          </p>
          <div className="mt-8">
            <ContactForm source="contact-page" />
          </div>
        </div>
      </section>
    </>
  );
}
