import { Header, Footer } from "@/components/organisms";
import { SITE_PHONE, SITE_WHATSAPP } from "@/lib/site";
import { getCategoryOptions } from "@/lib/categories";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategoryOptions();
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header phone={SITE_PHONE} whatsapp={SITE_WHATSAPP} categories={categories} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer categories={categories} />
    </>
  );
}
