import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  Breadcrumb,
  ContactForm,
  ProductDetailHero,
  ProductGridSection,
} from "@/components/organisms";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  type Product,
} from "@/lib/products";
import { productJsonLd } from "@/lib/jsonld";
import { SITE_PHONE, SITE_WHATSAPP } from "@/lib/site";
import type { ProductCardProps } from "@/components/molecules/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description,
  };
}

function toCard(p: Product): ProductCardProps {
  return {
    title: p.title,
    category: p.categoryLabel,
    sizes: p.sizes,
    href: `/products/${p.slug}`,
    badge: p.badge,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getRelatedProducts(product, 4)).map(toCard);

  return (
    <>
      <Script
        id={`ld-product-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />

      {/* Breadcrumb strip */}
      <div className="bg-[var(--bg-surface-muted)]">
        <div className="container-site py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              {
                label: product.categoryLabel,
                href: `/products?category=${product.category}`,
              },
              { label: product.title },
            ]}
          />
        </div>
      </div>

      <ProductDetailHero
        category={product.categoryLabel}
        title={product.title}
        description={product.description}
        phone={SITE_PHONE}
        whatsapp={SITE_WHATSAPP}
        specs={[
          { label: "SKU", value: product.sku },
          { label: "Material", value: product.material },
          { label: "Size options", value: product.sizes },
          { label: "Usage area", value: product.usageArea },
          { label: "Bulk supply", value: product.bulkSupply, highlight: true },
        ]}
      />

      <section
        id="quote"
        className="bg-[var(--bg-surface-muted)] section-pad-sm"
      >
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <p className="text-caption font-semibold uppercase tracking-wide text-brand-600">
                Request a Quote
              </p>
              <h2 className="mt-2 text-h2 font-bold tracking-tight">
                Get pricing for {product.title}
              </h2>
              <p className="mt-3 text-body text-[var(--fg-muted)]">
                Tell us your quantity and delivery timeline — we typically
                reply with a written quotation the same business day.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-sm sm:p-8">
              <ContactForm
                source="product-page"
                productId={product.id}
                showQuantity
                submitLabel="Request Quote"
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <ProductGridSection
          label="Related Products"
          title={`More from ${product.categoryLabel}`}
          seeAllHref={`/products?category=${product.category}`}
          seeAllLabel={`See all in ${product.categoryLabel}`}
          products={related}
          tone="muted"
        />
      )}
    </>
  );
}
