import type { Metadata } from "next";
import { ContactCard, PageHeader } from "@/components/organisms";
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
    </>
  );
}
