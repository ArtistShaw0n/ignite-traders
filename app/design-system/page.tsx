import {
  Building2,
  FlaskConical,
  Package,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  ArrowLink,
  Badge,
  BrandWordmark,
  Button,
  Dropdown,
  FilterPill,
  IconBox,
  Logo,
  SectionLabel,
  ThemeToggle,
  WhatsAppIcon,
} from "@/components/atoms";
import {
  AboutBlock,
  CallUsBlock,
  CompanyCard,
  CountdownTimer,
  FeatureCard,
  IndustryCard,
  ProductCard,
  ProductSpecRow,
  WhatsAppCTA,
} from "@/components/molecules";
import {
  PaginationDemo,
  ThumbnailGalleryDemo,
} from "./_design-demos/InteractiveDemos";

// Module-level constant — Date.now() outside render to keep the page pure.
const DEMO_OFFER_END = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000);

export default function DesignSystemPreview() {
  return (
    <main className="container-site section-pad space-y-16">
      {/* Header bar with theme toggle */}
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-3">
          <SectionLabel>Phase 1 + 2 — Tokens & Atoms</SectionLabel>
          <h1 className="text-display text-[var(--fg-primary)] tracking-tight">
            IGNITE Design System
          </h1>
          <p className="text-body-lg text-[var(--fg-secondary)] max-w-2xl">
            Foundational tokens — colors, typography, spacing, radius, shadows.
            Light + dark mode, mobile + tablet + desktop responsive.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Breakpoint indicator */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-muted)] p-4 flex items-center gap-3 flex-wrap">
        <span className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Current breakpoint
        </span>
        <span className="px-2.5 py-1 rounded-sm bg-brand-500 text-white text-body-sm font-bold sm:hidden">
          Mobile · &lt; 640px
        </span>
        <span className="px-2.5 py-1 rounded-sm bg-brand-500 text-white text-body-sm font-bold hidden sm:inline md:hidden">
          Small · 640+
        </span>
        <span className="px-2.5 py-1 rounded-sm bg-brand-500 text-white text-body-sm font-bold hidden md:inline lg:hidden">
          Tablet · 768+
        </span>
        <span className="px-2.5 py-1 rounded-sm bg-brand-500 text-white text-body-sm font-bold hidden lg:inline xl:hidden">
          Desktop · 1024+
        </span>
        <span className="px-2.5 py-1 rounded-sm bg-brand-500 text-white text-body-sm font-bold hidden xl:inline">
          Wide · 1280+
        </span>
        <span className="text-body-sm text-[var(--fg-muted)]">
          (resize your window to see responsive typography change)
        </span>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">Colors</h2>

        <ColorGroup
          title="Brand — Orange (Primary)"
          shades={[
            ["50", "bg-brand-50"],
            ["100", "bg-brand-100"],
            ["200", "bg-brand-200"],
            ["300", "bg-brand-300"],
            ["400", "bg-brand-400"],
            ["500", "bg-brand-500"],
            ["600", "bg-brand-600"],
            ["700", "bg-brand-700"],
            ["800", "bg-brand-800"],
            ["900", "bg-brand-900"],
          ]}
        />
        <ColorGroup
          title="Ink — Dark Teal / Navy"
          shades={[
            ["50", "bg-ink-50"],
            ["100", "bg-ink-100"],
            ["200", "bg-ink-200"],
            ["300", "bg-ink-300"],
            ["400", "bg-ink-400"],
            ["500", "bg-ink-500"],
            ["600", "bg-ink-600"],
            ["700", "bg-ink-700"],
            ["800", "bg-ink-800"],
            ["900", "bg-ink-900"],
          ]}
        />
        <ColorGroup
          title="Success / WhatsApp Green"
          shades={[
            ["50", "bg-success-50"],
            ["100", "bg-success-100"],
            ["200", "bg-success-200"],
            ["300", "bg-success-300"],
            ["400", "bg-success-400"],
            ["500", "bg-success-500"],
            ["600", "bg-success-600"],
            ["700", "bg-success-700"],
            ["800", "bg-success-800"],
            ["900", "bg-success-900"],
          ]}
        />
        <ColorGroup
          title="Neutrals"
          shades={[
            ["0", "bg-neutral-0"],
            ["50", "bg-neutral-50"],
            ["100", "bg-neutral-100"],
            ["200", "bg-neutral-200"],
            ["300", "bg-neutral-300"],
            ["400", "bg-neutral-400"],
            ["500", "bg-neutral-500"],
            ["600", "bg-neutral-600"],
            ["700", "bg-neutral-700"],
            ["800", "bg-neutral-800"],
            ["900", "bg-neutral-900"],
          ]}
        />

        {/* Semantic tokens */}
        <div className="space-y-3">
          <h3 className="text-h4 text-[var(--fg-primary)]">
            Semantic tokens (theme-aware)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SemanticSwatch label="bg-page" varName="--bg-page" />
            <SemanticSwatch label="bg-surface" varName="--bg-surface" />
            <SemanticSwatch label="bg-surface-muted" varName="--bg-surface-muted" />
            <SemanticSwatch label="bg-surface-strong" varName="--bg-surface-strong" />
            <SemanticSwatch label="border-default" varName="--border-default" />
            <SemanticSwatch label="border-strong" varName="--border-strong" />
          </div>
        </div>
      </section>

      {/* Badges — 9 variants */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">
          Badges — 3 styles × 3 colors
        </h2>
        <p className="text-body text-[var(--fg-secondary)]">
          Solid (filled), Soft (light tinted), Outline (stroke, no fill).
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <BadgeStyleColumn title="Solid">
            <Badge color="bestseller" variant="solid">Bestseller</Badge>
            <Badge color="bulk" variant="solid">Bulk</Badge>
            <Badge color="new" variant="solid">New</Badge>
          </BadgeStyleColumn>

          <BadgeStyleColumn title="Soft (light bg)">
            <Badge color="bestseller" variant="soft">Bestseller</Badge>
            <Badge color="bulk" variant="soft">Bulk</Badge>
            <Badge color="new" variant="soft">New</Badge>
          </BadgeStyleColumn>

          <BadgeStyleColumn title="Outline (stroke)">
            <Badge color="bestseller" variant="outline">Bestseller</Badge>
            <Badge color="bulk" variant="outline">Bulk</Badge>
            <Badge color="new" variant="outline">New</Badge>
          </BadgeStyleColumn>
        </div>
      </section>

      {/* Responsive Typography */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">
          Typography — responsive scale
        </h2>
        <p className="text-body text-[var(--fg-secondary)]">
          Sizes auto-adjust at <code className="text-brand-600 dark:text-brand-400">md (768px)</code>{" "}
          and <code className="text-brand-600 dark:text-brand-400">lg (1024px)</code> breakpoints.
        </p>

        <div className="space-y-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
          <TypeRow className="text-display" label="text-display" specs="36 / 48 / 60" />
          <TypeRow className="text-h1" label="text-h1" specs="30 / 36 / 48" />
          <TypeRow className="text-h2" label="text-h2" specs="24 / 30 / 36" />
          <TypeRow className="text-h3" label="text-h3" specs="20 / 24 / 28" />
          <TypeRow className="text-h4" label="text-h4" specs="18 / 20 / 22" />
          <TypeRow className="text-body-lg" label="text-body-lg" specs="18 / 18 / 20" />
          <TypeRow className="text-body" label="text-body" specs="16 / 16 / 16" />
          <TypeRow className="text-body-sm" label="text-body-sm" specs="14 / 14 / 14" />
          <TypeRow className="text-caption" label="text-caption" specs="12 / 12 / 12" />
        </div>

        <div className="rounded-lg bg-[var(--bg-surface-muted)] p-4">
          <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-1">
            Reading the specs
          </p>
          <p className="text-body-sm text-[var(--fg-secondary)]">
            <code>specs</code> shows pixel sizes:{" "}
            <span className="font-semibold">Mobile / Tablet (≥768) / Desktop (≥1024)</span>.
          </p>
        </div>
      </section>

      {/* Section Spacing */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">Section spacing</h2>
        <p className="text-body text-[var(--fg-secondary)]">
          Vertical padding scales with screen size.
        </p>

        <div className="overflow-x-auto rounded-lg border border-[var(--border-default)]">
          <table className="w-full text-body-sm">
            <thead className="bg-[var(--bg-surface-muted)] text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Tablet (≥768)</th>
                <th className="px-4 py-3 font-semibold">Desktop (≥1024)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              <SpacingRow cls="section-pad-sm" m="32px" t="48px" d="64px" />
              <SpacingRow cls="section-pad" m="48px" t="64px" d="96px" />
              <SpacingRow cls="section-pad-lg" m="64px" t="80px" d="128px" />
            </tbody>
          </table>
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">Border Radius</h2>
        <div className="flex flex-wrap gap-6">
          <RadiusBox label="sm · 6px" className="rounded-sm" />
          <RadiusBox label="md · 12px" className="rounded-md" />
          <RadiusBox label="lg · 20px" className="rounded-lg" />
          <RadiusBox label="xl · 24px" className="rounded-xl" />
          <RadiusBox label="2xl · 32px" className="rounded-2xl" />
          <RadiusBox label="pill" className="rounded-pill" />
        </div>
      </section>

      {/* Shadows */}
      <section className="space-y-6">
        <h2 className="text-h2 text-[var(--fg-primary)]">Shadows</h2>
        <div className="flex flex-wrap gap-6">
          <ShadowBox label="shadow-card" className="shadow-card" />
          <ShadowBox label="shadow-card-hover" className="shadow-card-hover" />
          <ShadowBox label="shadow-button" className="shadow-button" />
        </div>
      </section>

      {/* Container */}
      <section className="space-y-3">
        <h2 className="text-h2 text-[var(--fg-primary)]">Container</h2>
        <p className="text-body text-[var(--fg-secondary)]">
          Max width: <code className="text-brand-600 dark:text-brand-400">1280px</code> · Class:{" "}
          <code className="text-brand-600 dark:text-brand-400">.container-site</code> ·
          Responsive padding: 16 / 24 / 32 px
        </p>
      </section>

      {/* ============================================
          PHASE 2 — ATOMS
          ============================================ */}
      <section className="pt-12 border-t border-[var(--border-default)]">
        <SectionLabel>Phase 2 — Atoms</SectionLabel>
        <h2 className="text-h1 text-[var(--fg-primary)] mt-3">
          Reusable building blocks
        </h2>
        <p className="text-body-lg text-[var(--fg-secondary)] max-w-2xl mt-2">
          8 atoms — the smallest reusable components. Every molecule and
          organism is built from these.
        </p>
      </section>

      {/* Logo */}
      <AtomBlock name="Logo" description="Brand wordmark — links to home. 3 sizes.">
        <div className="flex items-end gap-8 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <Logo size="sm" />
            <span className="text-caption text-[var(--fg-muted)]">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Logo size="md" />
            <span className="text-caption text-[var(--fg-muted)]">md (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Logo size="lg" />
            <span className="text-caption text-[var(--fg-muted)]">lg</span>
          </div>
        </div>
      </AtomBlock>

      {/* BrandWordmark */}
      <AtomBlock
        name="BrandWordmark"
        description="Stylized brand-text placeholder used by CompanyCard's `logo` variant when image assets aren't yet available. 3 sizes × 2 weights × optional italic."
      >
        <div className="space-y-5">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Sample brand-style wordmarks
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <BrandWordmark text="BEACON" color="#1e40af" />
              <BrandWordmark text="SQUARE" color="#dc2626" italic />
              <BrandWordmark text="incepta" color="#047857" weight="bold" />
              <BrandWordmark text="RENATA" color="#7c2d12" />
            </div>
          </div>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Sizes — sm, md (default), lg
            </p>
            <div className="flex items-end gap-6">
              <BrandWordmark text="IGNITE" size="sm" color="#ef6b2a" />
              <BrandWordmark text="IGNITE" size="md" color="#ef6b2a" />
              <BrandWordmark text="IGNITE" size="lg" color="#ef6b2a" />
            </div>
          </div>
        </div>
      </AtomBlock>

      {/* SectionLabel */}
      <AtomBlock
        name="SectionLabel"
        description="Small uppercase muted-gray label — placed above section titles. Subordinate to the heading."
      >
        <div className="space-y-2">
          <SectionLabel>Featured Items</SectionLabel>
          <SectionLabel>Why Choose Ignite</SectionLabel>
          <SectionLabel>Urgent?</SectionLabel>
        </div>
      </AtomBlock>

      {/* Badge */}
      <AtomBlock
        name="Badge"
        description="9 variants: 3 colors (bestseller/bulk/new) × 3 styles (solid/soft/outline)."
      >
        <div className="flex flex-wrap gap-3">
          <Badge color="bestseller" variant="solid">Bestseller</Badge>
          <Badge color="bulk" variant="solid">Bulk</Badge>
          <Badge color="new" variant="solid">New</Badge>
          <Badge color="bestseller" variant="soft">Bestseller</Badge>
          <Badge color="bulk" variant="soft">Bulk</Badge>
          <Badge color="new" variant="soft">New</Badge>
          <Badge color="bestseller" variant="outline">Bestseller</Badge>
          <Badge color="bulk" variant="outline">Bulk</Badge>
          <Badge color="new" variant="outline">New</Badge>
        </div>
      </AtomBlock>

      {/* Button */}
      <AtomBlock
        name="Button"
        description="4 variants × 3 sizes. Renders <button> by default, <Link> when href is passed."
      >
        <div className="space-y-6">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Variants — primary, secondary, whatsapp, ghost
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="whatsapp">WhatsApp</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Sizes — sm, md (default), lg
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              States — disabled, fullWidth
            </p>
            <div className="flex flex-col gap-3 max-w-md">
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full width</Button>
            </div>
          </div>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              On dark background
            </p>
            <div className="flex flex-wrap gap-3 p-6 rounded-lg bg-ink-900">
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary" className="!text-white !border-white/30 hover:!bg-white/10">Secondary</Button>
              <Button variant="whatsapp">WhatsApp</Button>
            </div>
          </div>
        </div>
      </AtomBlock>

      {/* FilterPill */}
      <AtomBlock
        name="FilterPill"
        description="Rounded pill button with active/inactive states — used in category filters."
      >
        <div className="flex flex-wrap gap-2">
          <FilterPill active>All</FilterPill>
          <FilterPill>Protective Gown</FilterPill>
          <FilterPill>Head Cover</FilterPill>
          <FilterPill>Shoe Cover</FilterPill>
          <FilterPill>Gloves</FilterPill>
          <FilterPill>Safety Shoes</FilterPill>
          <FilterPill>Goggles</FilterPill>
        </div>
      </AtomBlock>

      {/* IconBox */}
      <AtomBlock
        name="IconBox"
        description="Light-tinted rounded square for icons. Used in industries, why-choose, call-us blocks."
      >
        <div className="space-y-5">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Sizes — sm, md, lg
            </p>
            <div className="flex items-end gap-4">
              <IconBox size="sm" icon={<ShieldCheck size={16} />} />
              <IconBox size="md" icon={<ShieldCheck size={20} />} />
              <IconBox size="lg" icon={<ShieldCheck size={26} />} />
            </div>
          </div>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Tones — brand (default), neutral
            </p>
            <div className="flex gap-4">
              <IconBox tone="brand" icon={<Phone size={20} />} />
              <IconBox tone="neutral" icon={<Phone size={20} />} />
            </div>
          </div>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Example icons (industries)
            </p>
            <div className="flex flex-wrap gap-4">
              <IconBox icon={<FlaskConical size={20} />} />
              <IconBox icon={<Building2 size={20} />} />
              <IconBox icon={<Package size={20} />} />
              <IconBox icon={<Truck size={20} />} />
            </div>
          </div>
        </div>
      </AtomBlock>

      {/* ArrowLink */}
      <AtomBlock
        name="ArrowLink"
        description="Text link with arrow icon — animated on hover. Used for 'See All', 'Details', etc."
      >
        <div className="flex flex-col gap-3 items-start">
          <ArrowLink href="#">See All</ArrowLink>
          <ArrowLink href="#">Details</ArrowLink>
          <ArrowLink href="#">See all in Protective Gown</ArrowLink>
        </div>
      </AtomBlock>

      {/* Dropdown */}
      <AtomBlock
        name="Dropdown"
        description="Click to open. Used for Sort dropdown on Products listing page."
      >
        <Dropdown
          label="Sort"
          defaultValue="popular"
          options={[
            { label: "Most popular", value: "popular" },
            { label: "Newest first", value: "newest" },
            { label: "Price: Low to High", value: "price-asc" },
            { label: "Price: High to Low", value: "price-desc" },
            { label: "Name: A → Z", value: "name-asc" },
          ]}
        />
      </AtomBlock>

      {/* WhatsAppIcon */}
      <AtomBlock
        name="WhatsAppIcon"
        description="Official WhatsApp brand mark. Renders in currentColor — Button's `whatsapp` variant uses this automatically. Pass any size."
      >
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <WhatsAppIcon size={16} className="text-whatsapp-500" />
            <span className="text-caption text-[var(--fg-muted)]">16</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <WhatsAppIcon size={20} className="text-whatsapp-500" />
            <span className="text-caption text-[var(--fg-muted)]">20</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <WhatsAppIcon size={28} className="text-whatsapp-500" />
            <span className="text-caption text-[var(--fg-muted)]">28</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-whatsapp-500">
              <WhatsAppIcon size={20} className="text-white" />
            </div>
            <span className="text-caption text-[var(--fg-muted)]">on bg</span>
          </div>
        </div>
      </AtomBlock>

      {/* ThemeToggle (already shown at top, but document here too) */}
      <AtomBlock
        name="ThemeToggle"
        description="Toggle between light and dark mode. Persists to localStorage."
      >
        <ThemeToggle />
      </AtomBlock>

      {/* ============================================
          PHASE 3 — MOLECULES
          ============================================ */}
      <section className="pt-12 border-t border-[var(--border-default)]">
        <SectionLabel>Phase 3 — Molecules</SectionLabel>
        <h2 className="text-h1 text-[var(--fg-primary)] mt-3">
          Composite UI components
        </h2>
        <p className="text-body-lg text-[var(--fg-secondary)] max-w-2xl mt-2">
          11 molecules — built from atoms, ready to be assembled into organisms.
        </p>
      </section>

      {/* ProductCard */}
      <AtomBlock
        name="ProductCard"
        description="Hero product card — image + optional badge + category + title + sizes + Details link. Used in 6+ places."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            title="Pharmaceutical Coverall Gown"
            category="Academic"
            sizes="S, M, L, XL, XXL"
            badge={{ color: "bestseller", label: "Bestseller" }}
            href="#"
          />
          <ProductCard
            title="Reusable Cotton Production Uniform"
            category="Protective Gown"
            sizes="S–XXL"
            badge={{ color: "bulk", label: "Bulk" }}
            href="#"
          />
          <ProductCard
            title="Disposable Visitor Gown"
            category="Protective Gown"
            sizes="Free"
            href="#"
          />
          <ProductCard
            title="Sterile Surgical Gown"
            category="Protective Gown"
            sizes="S, M, L, XL"
            badge={{ color: "new", label: "New" }}
            href="#"
          />
        </div>
      </AtomBlock>

      {/* IndustryCard — 3 variants */}
      <AtomBlock
        name="IndustryCard"
        description="Icon + name. 3 variants: default (left-aligned), centered, minimal (soft brand-tinted)."
      >
        <div className="space-y-6">
          <VariantBlock label="Variant: default · left-aligned">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <IndustryCard
                name="Pharmaceutical Manufacturing"
                icon={<ShieldCheck size={20} />}
              />
              <IndustryCard name="Production Industry" icon={<Building2 size={20} />} />
              <IndustryCard name="Packaging Industry" icon={<Package size={20} />} />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: centered">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <IndustryCard
                variant="centered"
                name="Pharmaceutical Manufacturing"
                icon={<ShieldCheck size={20} />}
              />
              <IndustryCard
                variant="centered"
                name="Production Industry"
                icon={<Building2 size={20} />}
              />
              <IndustryCard
                variant="centered"
                name="Packaging Industry"
                icon={<Package size={20} />}
              />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: minimal · soft brand-tinted card, larger icon, hover lift">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <IndustryCard
                variant="minimal"
                name="Pharmaceutical Manufacturing"
                icon={<ShieldCheck size={28} />}
              />
              <IndustryCard
                variant="minimal"
                name="Production Industry"
                icon={<Building2 size={28} />}
              />
              <IndustryCard
                variant="minimal"
                name="Packaging Industry"
                icon={<Package size={28} />}
              />
            </div>
          </VariantBlock>
        </div>
      </AtomBlock>

      {/* FeatureCard — 3 variants */}
      <AtomBlock
        name="FeatureCard"
        description="3 variants: default (number), iconed (IconBox at top), editorial (faded number watermark)."
      >
        <div className="space-y-6">
          <VariantBlock label="Variant: default · number + title + description">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                number="01"
                title="B2B-first supply"
                description="Pricing, lead times and sizes structured for procurement teams, not retail."
              />
              <FeatureCard
                number="02"
                title="Pharma-grade range"
                description="Every line is suited for hygiene-sensitive and controlled environments."
              />
              <FeatureCard
                number="03"
                title="Reliable sourcing"
                description="Vetted upstream suppliers and consistent stock for repeat orders."
              />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: iconed · uses the IconBox style from IndustryCard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                variant="iconed"
                number="01"
                title="B2B-first supply"
                description="Pricing, lead times and sizes structured for procurement teams, not retail."
                icon={<ShieldCheck size={20} />}
              />
              <FeatureCard
                variant="iconed"
                number="02"
                title="Pharma-grade range"
                description="Every line is suited for hygiene-sensitive and controlled environments."
                icon={<FlaskConical size={20} />}
              />
              <FeatureCard
                variant="iconed"
                number="03"
                title="Reliable sourcing"
                description="Vetted upstream suppliers and consistent stock for repeat orders."
                icon={<Truck size={20} />}
              />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: editorial · big faded number as watermark, minimal border">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                variant="editorial"
                number="01"
                title="B2B-first supply"
                description="Pricing, lead times and sizes structured for procurement teams, not retail."
              />
              <FeatureCard
                variant="editorial"
                number="02"
                title="Pharma-grade range"
                description="Every line is suited for hygiene-sensitive and controlled environments."
              />
              <FeatureCard
                variant="editorial"
                number="03"
                title="Reliable sourcing"
                description="Vetted upstream suppliers and consistent stock for repeat orders."
              />
            </div>
          </VariantBlock>
        </div>
      </AtomBlock>

      {/* CompanyCard — 3 variants */}
      <AtomBlock
        name="CompanyCard"
        description="3 variants: initials (compact), logo (logo only), stacked (logo on top + name below)."
      >
        <div className="space-y-6">
          <VariantBlock label="Variant: initials · short initials + company name (compact)">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CompanyCard variant="initials" initials="RI" name="Renata Industries" />
              <CompanyCard variant="initials" initials="AG" name="ACME Generics" />
              <CompanyCard variant="initials" initials="OH" name="Opsonin Health" />
              <CompanyCard variant="initials" initials="DI" name="Drug International" />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: logo · just the brand logo (no name)">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CompanyCard
                variant="logo"
                alt="Beacon Pharmaceuticals"
                logo={<BrandWordmark text="BEACON" color="#1e40af" />}
              />
              <CompanyCard
                variant="logo"
                alt="Square Pharmaceuticals"
                logo={<BrandWordmark text="SQUARE" color="#dc2626" italic />}
              />
              <CompanyCard
                variant="logo"
                alt="Incepta Pharmaceuticals"
                logo={<BrandWordmark text="incepta" color="#047857" weight="bold" />}
              />
              <CompanyCard
                variant="logo"
                alt="Renata Industries"
                logo={<BrandWordmark text="RENATA" color="#7c2d12" />}
              />
            </div>
          </VariantBlock>

          <VariantBlock label="Variant: stacked · logo on top, name below">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CompanyCard
                variant="stacked"
                logo={<BrandWordmark text="BEACON" color="#1e40af" />}
                name="Beacon Pharmaceuticals Limited"
              />
              <CompanyCard
                variant="stacked"
                logo={<BrandWordmark text="SQUARE" color="#dc2626" italic />}
                name="Square Pharmaceuticals Ltd."
              />
              <CompanyCard
                variant="stacked"
                logo={<BrandWordmark text="incepta" color="#047857" weight="bold" />}
                name="Incepta Pharmaceuticals Ltd"
              />
              <CompanyCard
                variant="stacked"
                logo={<BrandWordmark text="RENATA" color="#7c2d12" />}
                name="Renata Industries"
              />
            </div>
          </VariantBlock>
        </div>
      </AtomBlock>

      {/* CallUsBlock */}
      <AtomBlock
        name="CallUsBlock"
        description="Phone icon + label + number. Two tones: default and onDark."
      >
        <div className="space-y-4">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
              Default
            </p>
            <CallUsBlock phone="01798214677" />
          </div>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
              On dark background
            </p>
            <div className="p-5 rounded-lg bg-ink-900 inline-block">
              <CallUsBlock phone="01798214677" onDark />
            </div>
          </div>
        </div>
      </AtomBlock>

      {/* CountdownTimer */}
      <AtomBlock
        name="CountdownTimer"
        description="Live countdown to a target date. Updates every 30s. Two tones."
      >
        <div className="space-y-5">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              On brand (orange banner)
            </p>
            <div className="p-5 rounded-lg bg-brand-500 inline-block">
              <CountdownTimer
                targetDate={DEMO_OFFER_END}
                tone="onBrand"
              />
            </div>
          </div>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
              Default (surface)
            </p>
            <CountdownTimer targetDate={DEMO_OFFER_END} tone="default" />
          </div>
        </div>
      </AtomBlock>

      {/* ProductSpecRow */}
      <AtomBlock
        name="ProductSpecRow"
        description="Spec row (label + value). Used in product detail page."
      >
        <dl className="rounded-lg border border-[var(--border-default)] divide-y divide-[var(--border-muted)] px-5">
          <ProductSpecRow label="SKU" value="IGN-GWN-101" />
          <ProductSpecRow label="Material" value="Non-woven polypropylene, 40 GSM" />
          <ProductSpecRow label="Size options" value="S, M, L, XL, XXL" />
          <ProductSpecRow
            label="Usage area"
            value="Pharmaceutical, food processing, hospital & laboratory"
          />
          <ProductSpecRow
            label="Bulk supply"
            value="Available — MOQ on request"
            highlight
          />
        </dl>
      </AtomBlock>

      {/* ThumbnailButton */}
      <AtomBlock
        name="ThumbnailButton"
        description="Product gallery thumbnail. Click to select (active state with orange ring)."
      >
        <ThumbnailGalleryDemo />
      </AtomBlock>

      {/* AboutBlock */}
      <AtomBlock
        name="AboutBlock"
        description="Heading + body paragraph. Used 5x on About page."
      >
        <div className="space-y-6 max-w-3xl">
          <AboutBlock
            heading="Who we are"
            body="A Dhaka-based B2B supplier of protective wear and safety items, focused on the consistent, reliable supply that pharmaceutical production needs."
          />
          <AboutBlock
            heading="What we focus on"
            body="Hygiene-sensitive supply chains where consistency, batch quality, and predictable lead times matter more than retail-style variety."
          />
        </div>
      </AtomBlock>

      {/* Pagination */}
      <AtomBlock
        name="Pagination"
        description="Smart pagination with ellipsis. Try clicking — current page updates."
      >
        <PaginationDemo />
      </AtomBlock>

      {/* WhatsAppCTA */}
      <AtomBlock
        name="WhatsAppCTA"
        description="Pre-configured WhatsApp button with wa.me link. Phone + optional message."
      >
        <div className="flex flex-wrap items-center gap-3">
          <WhatsAppCTA phone="8801798214677" size="sm" />
          <WhatsAppCTA phone="8801798214677" size="md" />
          <WhatsAppCTA phone="8801798214677" size="lg" />
          <WhatsAppCTA
            phone="8801798214677"
            label="Chat now"
            message="Hi! I want to inquire about bulk order."
          />
        </div>
      </AtomBlock>

      {/* ============================================
          PHASE 4 — ORGANISMS (linked preview)
          ============================================ */}
      <section className="pt-12 border-t border-[var(--border-default)]">
        <SectionLabel>Phase 4 — Organisms</SectionLabel>
        <h2 className="text-h1 text-[var(--fg-primary)] mt-3">
          Full page sections
        </h2>
        <p className="text-body-lg text-[var(--fg-secondary)] max-w-2xl mt-2">
          19 organisms — layout (Header, Footer, Breadcrumb, PageHeader) +
          home-page sections (HeroBanner, ProductGridSection, IndustriesSection,
          WhyChooseSection, etc.) + product-detail + about + contact sections.
        </p>
        <p className="text-body-lg text-[var(--fg-secondary)] mt-4">
          Organisms render at full viewport width — they don&apos;t fit in a card
          showcase. View them in their natural environment:
        </p>
        <div className="mt-6">
          <Button href="/preview/organisms" size="lg">
            Open Organisms Preview →
          </Button>
        </div>
      </section>

      <footer className="pt-12 border-t border-[var(--border-default)]">
        <p className="text-body-sm text-[var(--fg-muted)]">
          Phases 1–4 complete · Next: Phase 5 — Page Assembly (real Home,
          Products, Product Detail, About, Contact pages)
        </p>
      </footer>
    </main>
  );
}

/* ---------- Helper components ---------- */

function ColorGroup({
  title,
  shades,
}: {
  title: string;
  /**
   * Each entry is [shade, fullClassName]. The className is a literal Tailwind
   * class (e.g. "bg-brand-500") so Tailwind's JIT scanner detects it and
   * generates both the utility AND emits the underlying CSS variable to :root.
   */
  shades: Array<[shade: string, className: string]>;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-h4 text-[var(--fg-primary)]">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {shades.map(([shade, className]) => (
          <div key={shade} className="flex flex-col items-center gap-1">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-[var(--border-default)] ${className}`}
            />
            <span className="text-caption text-[var(--fg-muted)]">{shade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticSwatch({
  label,
  varName,
}: {
  label: string;
  varName: string;
}) {
  return (
    <div className="rounded-md border border-[var(--border-default)] overflow-hidden">
      <div
        className="h-14 w-full"
        style={{ background: `var(${varName})` }}
      />
      <div className="px-3 py-2 bg-[var(--bg-surface)]">
        <code className="text-body-sm text-[var(--fg-primary)]">{label}</code>
      </div>
    </div>
  );
}

function BadgeStyleColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-3">
      <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function TypeRow({
  label,
  specs,
  className,
}: {
  label: string;
  specs: string;
  className: string;
}) {
  return (
    <div className="flex items-baseline gap-4 flex-wrap py-2 border-b border-[var(--border-muted)] last:border-0">
      <div className="flex-shrink-0 w-32">
        <code className="text-body-sm text-[var(--fg-secondary)]">{label}</code>
        <p className="text-caption text-[var(--fg-muted)] mt-0.5">{specs}</p>
      </div>
      <span className={`${className} text-[var(--fg-primary)] flex-1 min-w-0`}>
        The quick brown fox
      </span>
    </div>
  );
}

function SpacingRow({
  cls,
  m,
  t,
  d,
}: {
  cls: string;
  m: string;
  t: string;
  d: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3">
        <code className="text-brand-600 dark:text-brand-400">.{cls}</code>
      </td>
      <td className="px-4 py-3 text-[var(--fg-secondary)]">{m}</td>
      <td className="px-4 py-3 text-[var(--fg-secondary)]">{t}</td>
      <td className="px-4 py-3 text-[var(--fg-secondary)]">{d}</td>
    </tr>
  );
}

function RadiusBox({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-brand-500 ${className}`} />
      <span className="text-caption text-[var(--fg-muted)]">{label}</span>
    </div>
  );
}

function ShadowBox({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-28 h-28 sm:w-32 sm:h-32 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-default)] ${className}`}
      />
      <span className="text-caption text-[var(--fg-muted)]">{label}</span>
    </div>
  );
}

function AtomBlock({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 md:p-8">
      <header className="space-y-1">
        <h3 className="text-h3 text-[var(--fg-primary)]">
          <code className="text-brand-600 dark:text-brand-400">
            &lt;{name} /&gt;
          </code>
        </h3>
        <p className="text-body-sm text-[var(--fg-secondary)]">{description}</p>
      </header>
      <div className="pt-2">{children}</div>
    </section>
  );
}

function VariantBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-caption font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        {label}
      </p>
      {children}
    </div>
  );
}

