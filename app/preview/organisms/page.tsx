import { Building2, FlaskConical, Hospital, Package, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import {
  AboutContent,
  Breadcrumb,
  BulkOfferBanner,
  BulkQuoteCTA,
  CategoryFilterSection,
  ContactCard,
  Footer,
  Header,
  HeroBanner,
  IndustriesSection,
  PageHeader,
  ProductDetailHero,
  ProductGridSection,
  RequestQuoteCTA,
  ResultsBar,
  TrustedCompaniesSection,
  WhyChooseSection,
} from "@/components/organisms";
import type { ProductCardProps } from "@/components/molecules/ProductCard";

/** Sample data — reused across previews */
const SAMPLE_PRODUCTS: ProductCardProps[] = [
  {
    title: "Pharmaceutical Coverall Gown",
    category: "Academic",
    sizes: "S, M, L, XL, XXL",
    badge: { color: "bestseller", label: "Bestseller" },
    href: "#",
  },
  {
    title: "Reusable Cotton Production Uniform",
    category: "Protective Gown",
    sizes: "S–XXL",
    badge: { color: "bulk", label: "Bulk" },
    href: "#",
  },
  {
    title: "Disposable Visitor Gown",
    category: "Protective Gown",
    sizes: "Free",
    href: "#",
  },
  {
    title: "Sterile Surgical Gown",
    category: "Protective Gown",
    sizes: "S, M, L, XL",
    badge: { color: "new", label: "New" },
    href: "#",
  },
];

const PHONE = "01798214677";
const WHATSAPP = "8801798214677";
const FUTURE_DATE = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000);

export default function OrganismsPreview() {
  // Dev-only preview — hidden in production.
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <>
      <Header phone={PHONE} whatsapp={WHATSAPP} />

      <main>
        <SectionLabel name="HeroBanner" />
        <HeroBanner
          badge="New Edition 2026"
          title="Protective Wear for Pharma Production"
          description="IGNITE delivers gowns, gloves, masks, shoes and lab safety gear — built for pharmaceutical production lines."
          primaryCta={{ label: "Browse Products", href: "/products" }}
          secondaryCta={{ label: "Request Quote", href: "/contact" }}
        />

        <SectionLabel name="CategoryFilterSection" />
        <CategoryFilterSection
          title="Built for production environments"
          categories={[
            "All",
            "Protective Gown",
            "Head Cover",
            "Shoe Cover",
            "Gloves",
            "Safety Shoes",
            "Goggles",
            "Other",
          ]}
          defaultCategory="All"
        />

        <SectionLabel name="ProductGridSection" />
        <ProductGridSection
          label="Featured Items"
          title="Production-line essentials"
          seeAllHref="/products"
          products={SAMPLE_PRODUCTS}
        />

        <SectionLabel name="BulkOfferBanner" />
        <BulkOfferBanner
          title="Bulk Quote Offer"
          description="Up to 15% off on selected protective wear for orders above 500 units."
          cta={{ label: "Up to 15% off", href: "/contact" }}
          targetDate={FUTURE_DATE}
        />

        <SectionLabel name="ProductGridSection (muted bg variant)" />
        <ProductGridSection
          label="Protective Gown"
          title="What procurement teams reorder"
          seeAllHref="/products"
          products={SAMPLE_PRODUCTS}
          tone="muted"
        />

        <SectionLabel name="IndustriesSection" />
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

        <SectionLabel name="WhyChooseSection" />
        <WhyChooseSection
          title="A supplier production teams can rely on"
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

        <SectionLabel name="TrustedCompaniesSection" />
        <TrustedCompaniesSection
          title="Trusted by procurement teams across pharma & production"
          companies={[
            { variant: "initials", initials: "BP", name: "Beacon Pharmaceuticals" },
            { variant: "initials", initials: "SP", name: "Square Pharmaceuticals" },
            { variant: "initials", initials: "IP", name: "Incepta Pharmaceuticals" },
            { variant: "initials", initials: "RI", name: "Renata Industries" },
            { variant: "initials", initials: "AG", name: "ACME Generics" },
            { variant: "initials", initials: "OH", name: "Opsonin Health" },
            { variant: "initials", initials: "AP", name: "Aristopharma Group" },
            { variant: "initials", initials: "DI", name: "Drug International" },
          ]}
        />

        <SectionLabel name="RequestQuoteCTA" />
        <RequestQuoteCTA
          title="Need bulk supply for your production unit?"
          description="Tell us what you need — quantity, sizes, delivery window — and we'll come back with a quotation, usually the same business day."
          phone={PHONE}
          whatsapp={WHATSAPP}
          whatsappMessage="Hi! I'd like a bulk quote."
        />

        <SectionLabel name="PageHeader (Products page)" />
        <PageHeader
          title="Browse our products"
          description="Industrial supplies, PPE, electrical components — sourced and stocked for fast dispatch. Filter by category or search for specific items."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        />

        <div className="container-site">
          <SectionLabel name="ResultsBar" />
          <ResultsBar shown={24} total={156} />
        </div>

        <SectionLabel name="BulkQuoteCTA" />
        <BulkQuoteCTA />

        <SectionLabel name="PageHeader (Product detail breadcrumb)" />
        <div className="bg-[var(--bg-surface-muted)] py-4">
          <div className="container-site">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                {
                  label: "Protective Gown",
                  href: "/products?category=protective-gown",
                },
                { label: "Pharmaceutical Coverall Gown" },
              ]}
            />
          </div>
        </div>

        <SectionLabel name="ProductDetailHero" />
        <ProductDetailHero
          category="Protective Gown"
          title="Pharmaceutical Coverall Gown"
          description="Full-body coverall with hood for pharmaceutical clean-room use."
          phone={PHONE}
          whatsapp={WHATSAPP}
          specs={[
            { label: "SKU", value: "IGN-GWN-101" },
            { label: "Material", value: "Non-woven polypropylene, 40 GSM" },
            { label: "Size options", value: "S, M, L, XL, XXL" },
            {
              label: "Usage area",
              value: "Pharmaceutical, food processing, hospital & laboratory",
            },
            {
              label: "Bulk supply",
              value: "Available — MOQ on request",
              highlight: true,
            },
          ]}
        />

        <SectionLabel name="PageHeader (About)" />
        <PageHeader
          title="About IGNITE"
          description="A Dhaka-based B2B supplier of protective wear and safety items, focused on the consistent, reliable supply that pharmaceutical production needs."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        />

        <SectionLabel name="AboutContent" />
        <AboutContent
          blocks={[
            {
              heading: "Who we are",
              body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation ullamco. [TODO replace verbatim]",
            },
            {
              heading: "What we focus on",
              body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit. [TODO replace verbatim]",
            },
            {
              heading: "Industry specialisation",
              body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sint occaecat cupidatat non proident sunt in culpa qui officia. [TODO replace verbatim]",
            },
            {
              heading: "Commitment to quality and timely delivery",
              body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error. [TODO replace verbatim]",
            },
            {
              heading: "Our values",
              body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis. [TODO replace verbatim]",
            },
          ]}
        />

        <SectionLabel name="PageHeader (Contact)" />
        <PageHeader
          title="Contact IGNITE"
          description="Send us your inquiry — bulk quotes, product questions, or partnership conversations. Our procurement team responds within 24 hours."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        />

        <SectionLabel name="ContactCard" />
        <ContactCard phone={PHONE} whatsapp={WHATSAPP} />
      </main>

      <Footer />
    </>
  );
}

/** Small in-page label to demarcate each organism in the preview flow. */
function SectionLabel({ name }: { name: string }) {
  return (
    <div className="bg-ink-800 text-white">
      <div className="container-site py-2 flex items-center gap-2">
        <span className="text-caption font-bold uppercase tracking-wider text-brand-400">
          Organism
        </span>
        <code className="text-body-sm text-white">&lt;{name} /&gt;</code>
      </div>
    </div>
  );
}
