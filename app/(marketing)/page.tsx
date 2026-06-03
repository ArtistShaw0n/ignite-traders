import {
  Building2,
  FlaskConical,
  Hospital,
  Package,
  ShieldCheck,
} from "lucide-react";
import { BrandWordmark } from "@/components/atoms";
import {
  BulkOfferBanner,
  CategoryFilterSection,
  FaqSection,
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
import {
  PRODUCT_CATEGORIES,
  SITE_PHONE,
  SITE_WHATSAPP,
} from "@/lib/site";
import type { ProductCardProps } from "@/components/molecules/ProductCard";

function toCard(p: Product): ProductCardProps {
  return {
    title: p.title,
    category: p.categoryLabel,
    sizes: p.sizes,
    href: `/products/${p.slug}`,
    badge: p.badge,
  };
}

// Computed once at module load (server-side at build/request time) — kept
// outside the component to satisfy the react-hooks/purity rule against
// calling Date.now() during render.
const OFFER_END_DATE = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000);

export default async function HomePage() {
  const [featuredRows, protectiveGownRows, bestsellerRows] = await Promise.all([
    getFeaturedProducts(4),
    getProtectiveGowns(4),
    getBestsellers(4),
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
        secondaryCta={{ label: "Request Quote", href: "/contact" }}
        whatsappCta={{
          phone: SITE_WHATSAPP,
          message: "Hi! I'd like to know more about IGNITE products.",
          label: "WhatsApp Chat",
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
        categories={PRODUCT_CATEGORIES.map((c) => c.label)}
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
        cta={{ label: "Up to 15% off", href: "/contact" }}
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
            description:
              "Every line is suited for hygiene-sensitive and controlled environments.",
          },
          {
            number: "03",
            title: "Reliable sourcing",
            description:
              "Vetted upstream suppliers and consistent stock for repeat orders.",
          },
          {
            number: "04",
            title: "Quality consistency",
            description:
              "Each batch checked against documented specs before dispatch.",
          },
          {
            number: "05",
            title: "Responsive communication",
            description:
              "Quotation responses in hours, not days. Direct line to a real human.",
          },
          {
            number: "06",
            title: "Bulk order support",
            description:
              "Comfortable with one-time bulk and ongoing recurring supply.",
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
            logo: (
              <BrandWordmark text="incepta" color="#047857" weight="bold" />
            ),
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
            logo: (
              <BrandWordmark text="OPSONIN" color="#7c3aed" weight="bold" />
            ),
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

      <FaqSection
        title="Frequently asked questions"
        description="Quick answers on ordering, lead times and bulk supply. Don't see your question? Reach us on WhatsApp."
        tone="muted"
        items={[
          {
            question: "What's the minimum order quantity?",
            answer:
              "For most protective wear we accept orders from 100 units, but pricing is best on orders above 500. Share your requirement on the contact form and we'll quote both tiers.",
          },
          {
            question: "How quickly can you deliver bulk orders?",
            answer:
              "Standard lead time is 3–7 business days for in-stock items within Bangladesh. Larger or custom-spec orders typically ship in 10–15 business days. We confirm exact dates at quotation.",
          },
          {
            question: "Do you supply to industries outside pharmaceutical?",
            answer:
              "Yes. We regularly supply food processing, packaging, hospitals & laboratories, and general production units. The product range is built for hygiene-sensitive and controlled environments across all of these.",
          },
          {
            question: "Can I get product samples before placing a bulk order?",
            answer:
              "We can arrange paid samples for procurement teams evaluating a new line. Sample cost is typically adjusted against the first bulk order. Mention this when requesting a quote.",
          },
          {
            question: "How do I request a quotation?",
            answer:
              "Use the Request Quote form on the contact page or message us on WhatsApp with the items, quantities, sizes and delivery window. You'll usually get a written quotation back the same business day.",
          },
          {
            question: "What payment terms do you offer for repeat buyers?",
            answer:
              "First orders are typically advance payment. Established procurement partners can move to partial advance with balance on delivery, or formal credit terms after a few completed cycles.",
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
