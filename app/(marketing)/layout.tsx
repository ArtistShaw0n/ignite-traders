import { Header, Footer } from "@/components/organisms";
import { SITE_PHONE, SITE_WHATSAPP } from "@/lib/site";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header phone={SITE_PHONE} whatsapp={SITE_WHATSAPP} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
