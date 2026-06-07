import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Breadcrumb, ProductDetailHero, ProductGridSection } from "@/components/organisms";
import { getAllProducts, getProductBySlug, getRelatedProducts, type Product } from "@/lib/products";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    image: p.image,
    imageAlt: p.title,
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
        images={product.images.map((im) => ({
          src: im.url,
          alt: im.alt ?? product.title,
        }))}
        specs={[
          { label: "SKU", value: product.sku },
          { label: "Material", value: product.material },
          { label: "Size options", value: product.sizes },
          { label: "Usage area", value: product.usageArea },
          { label: "Bulk supply", value: product.bulkSupply, highlight: true },
        ]}
      />

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
