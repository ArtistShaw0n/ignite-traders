import { Building2, FlaskConical, Hospital, Package, ShieldCheck } from "lucide-react";
import { BrandWordmark } from "@/components/atoms";
import {
  BulkOfferBanner,
  CategoryFilterSection,
  HeroBanner,
  IndustriesSection,
  ProductGridSection,
  RequestQuoteCTA,
  TrustedCompaniesSection,
  WhyChooseSection,
} from "@/components/organisms";
import {
  getBestsellers,
  getFeaturedProducts,
  getProtectiveGowns,
  type Product,
} from "@/lib/products";
import { SITE_PHONE, SITE_WHATSAPP } from "@/lib/site";
import { getCategories } from "@/lib/categories";
import type { ProductCardProps } from "@/components/molecules/ProductCard";

function toCard(p: Product): ProductCardProps {
  return {
    title: p.title,
    category: p.categoryLabel,
    sizes: p.sizes,
    href: `/products/${p.slug}`,
    badge: p.badge,
    image: p.image,
    imageAlt: p.title,
  };
}

// Computed once at module load (server-side at build/request time) — kept
// outside the component to satisfy the react-hooks/purity rule against
// calling Date.now() during render.
const OFFER_END_DATE = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000);

export default async function HomePage() {
  const [featuredRows, protectiveGownRows, bestsellerRows, cats] = await Promise.all([
    getFeaturedProducts(4),
    getProtectiveGowns(4),
    getBestsellers(4),
    getCategories(),
  ]);
  const featured = featuredRows.map(toCard);
  const protectiveGowns = protectiveGownRows.map(toCard);
  const bestsellers = bestsellerRows.map(toCard);

  return (
    <>
      <HeroBanner
        badge="New Edition 2026"
        title="Protective Wear for Pharma Production"
        description="IGNITE delivers gowns, gloves, masks, shoes and lab safety gear — built for pharmaceutical production lines."
        primaryCta={{ label: "Browse Products", href: "/products" }}
        whatsappCta={{
          phone: SITE_WHATSAPP,
          message: "Hi! I'd like a quote for IGNITE products.",
          label: "Request a Quote",
        }}
      />

      {/*
        Strict alternating bg flow: white → muted → white → muted → …
        (excludes the final two sections RequestQuoteCTA + Footer which are dark)

        1.  Hero           → white
        2.  Category       → muted
        3.  Featured       → white
        4.  BulkOffer      → muted
        5.  Protective     → white
        6.  Bestsellers    → muted
        7.  Industries     → white
        8.  WhyChoose      → muted
        9.  Companies      → white
        10. FAQ            → muted
        11. RequestQuote   → dark (excluded)
        12. Footer         → dark (excluded)
      */}

      <CategoryFilterSection
        title="Built for production environments"
        categories={["All", ...cats.map((c) => c.label)]}
        defaultCategory="All"
        tone="muted"
      />

      <ProductGridSection
        label="Featured Items"
        title="Production-line essentials"
        seeAllHref="/products"
        products={featured}
      />

      <BulkOfferBanner
        title="Bulk Quote Offer"
        description="Up to 15% off on selected protective wear for orders above 500 units."
        cta={{
          label: "Up to 15% off",
          href: `https://wa.me/${SITE_WHATSAPP}?text=${encodeURIComponent(
            "Hi! I'm interested in the bulk offer (up to 15% off).",
          )}`,
        }}
        targetDate={OFFER_END_DATE}
        tone="muted"
      />

      <ProductGridSection
        label="Protective Gown"
        title="What procurement teams reorder"
        seeAllHref="/products?category=protective-gown"
        products={protectiveGowns}
      />

      <ProductGridSection
        label="Bestsellers"
        title="Most ordered this quarter"
        seeAllHref="/products"
        products={bestsellers}
        tone="muted"
      />

      <IndustriesSection
        title="Where Ignite supplies"
        industries={[
          {
            name: "Pharmaceutical Manufacturing",
            icon: <ShieldCheck size={20} />,
          },
          { name: "Production Industry", icon: <Building2 size={20} /> },
          { name: "Packaging Industry", icon: <Package size={20} /> },
          { name: "Food Processing", icon: <FlaskConical size={20} /> },
          { name: "Hospital & Laboratory", icon: <Hospital size={20} /> },
        ]}
      />

      <WhyChooseSection
        title="A supplier production teams can rely on"
        variant="editorial"
        tone="muted"
        features={[
          {
            number: "01",
            title: "B2B-first supply",
            description:
              "Pricing, lead times and sizes structured for procurement teams, not retail.",
          },
          {
            number: "02",
            title: "Pharma-grade range",
            description: "Every line is suited for hygiene-sensitive and controlled environments.",
          },
          {
            number: "03",
            title: "Reliable sourcing",
            description: "Vetted upstream suppliers and consistent stock for repeat orders.",
          },
          {
            number: "04",
            title: "Quality consistency",
            description: "Each batch checked against documented specs before dispatch.",
          },
          {
            number: "05",
            title: "Responsive communication",
            description: "Quotation responses in hours, not days. Direct line to a real human.",
          },
          {
            number: "06",
            title: "Bulk order support",
            description: "Comfortable with one-time bulk and ongoing recurring supply.",
          },
        ]}
      />

      <TrustedCompaniesSection
        title="Trusted by procurement teams across pharma & production"
        companies={[
          {
            variant: "logo",
            alt: "Beacon Pharmaceuticals",
            logo: <BrandWordmark text="BEACON" color="#1e40af" />,
          },
          {
            variant: "logo",
            alt: "Square Pharmaceuticals",
            logo: <BrandWordmark text="SQUARE" color="#dc2626" italic />,
          },
          {
            variant: "logo",
            alt: "Incepta Pharmaceuticals",
            logo: <BrandWordmark text="incepta" color="#047857" weight="bold" />,
          },
          {
            variant: "logo",
            alt: "Renata Industries",
            logo: <BrandWordmark text="RENATA" color="#7c2d12" />,
          },
          {
            variant: "logo",
            alt: "ACME Generics",
            logo: <BrandWordmark text="ACME" color="#0891b2" />,
          },
          {
            variant: "logo",
            alt: "Opsonin Health",
            logo: <BrandWordmark text="OPSONIN" color="#7c3aed" weight="bold" />,
          },
          {
            variant: "logo",
            alt: "Aristopharma Group",
            logo: <BrandWordmark text="ARISTO" color="#be123c" italic />,
          },
          {
            variant: "logo",
            alt: "Drug International",
            logo: <BrandWordmark text="DRUG INT'L" color="#1e3a8a" />,
          },
        ]}
      />

      <RequestQuoteCTA
        title="Need bulk supply for your production unit?"
        description="Tell us what you need — quantity, sizes, delivery window — and we'll come back with a quotation, usually the same business day."
        phone={SITE_PHONE}
        whatsapp={SITE_WHATSAPP}
        whatsappMessage="Hi! I'd like a bulk quote."
      />
    </>
  );
}
