import productsData from "@/data/products.json";

export interface ProductBadge {
  color: "bestseller" | "bulk" | "new";
  label: string;
}

export interface Product {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  sizes: string;
  badge?: ProductBadge;
  description: string;
  sku: string;
  material: string;
  usageArea: string;
  bulkSupply: string;
}

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(
  current: Product,
  limit = 4,
): Product[] {
  return products
    .filter((p) => p.category === current.category && p.slug !== current.slug)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.badge).slice(0, limit);
}

export function getBestsellers(limit = 4): Product[] {
  return products
    .filter((p) => p.badge?.color === "bestseller")
    .slice(0, limit);
}

export function getProtectiveGowns(limit = 4): Product[] {
  return products.filter((p) => p.category === "protective-gown").slice(0, limit);
}
