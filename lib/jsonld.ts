import {
  SITE_ADDRESS,
  SITE_CITY,
  SITE_COUNTRY,
  SITE_EMAIL,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_PHONE,
  SITE_TAGLINE,
} from "./site";
import type { Product } from "./products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ignitetradersbd.com";

/** Organization JSON-LD — used in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS,
      addressLocality: SITE_CITY,
      addressCountry: SITE_COUNTRY,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: SITE_PHONE,
      email: SITE_EMAIL,
      areaServed: "BD",
      availableLanguage: ["en", "bn"],
    },
  };
}

/** Product JSON-LD — used in product detail pages. */
export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    description: product.description,
    category: product.categoryLabel,
    material: product.material,
    url: `${SITE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "BDT",
      seller: {
        "@type": "Organization",
        name: SITE_LEGAL_NAME,
      },
    },
  };
}
