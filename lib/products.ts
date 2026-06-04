import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { products as productsTable } from "@/db/schema";

export interface ProductBadge {
  color: "bestseller" | "bulk" | "new";
  label: string;
}

/**
 * Product shape used across the marketing site.
 *
 * Sourced from the `products` table in Postgres (Phase 7). The shape is
 * deliberately kept close to the pre-Phase-7 JSON layout so existing
 * consumers (cards, hero, JSON-LD, sitemap) don't need to be rewritten —
 * we adapt at the boundary instead.
 *
 * Notes:
 * - `id` (UUID) is exposed so per-product forms can submit a real FK.
 * - `category` is the slug used in URLs (`/products?category=gloves`),
 *   matching the legacy `category` field. The DB column is `category_slug`.
 * - `sizes` is joined back to a comma-separated string for card display.
 */
export interface ProductImageRef {
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
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
  /** First image URL — convenient for card thumbnails. */
  image?: string;
  /** All images, in order — used by the detail-page gallery. */
  images: ProductImageRef[];
}

type DbProduct = typeof productsTable.$inferSelect;

function fromDb(row: DbProduct): Product {
  const badge = (row.badge as ProductBadge | null) ?? undefined;
  const images: ProductImageRef[] = Array.isArray(row.images)
    ? (row.images as ProductImageRef[]).filter(
        (i) => i && typeof i.url === "string",
      )
    : [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.categorySlug,
    categoryLabel: row.categoryLabel,
    sizes: row.sizes.join(", "),
    badge,
    description: row.description,
    sku: row.sku,
    material: row.material,
    usageArea: row.usageArea,
    bulkSupply: row.bulkSupply,
    image: images[0]?.url,
    images,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title));
  return rows.map(fromDb);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug))
    .limit(1);
  return row ? fromDb(row) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === "all") return getAllProducts();
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.categorySlug, category))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title));
  return rows.map(fromDb);
}

export async function getRelatedProducts(
  current: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.categorySlug, current.category),
        ne(productsTable.slug, current.slug),
      ),
    )
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title))
    .limit(limit);
  return rows.map(fromDb);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title))
    .limit(limit);
  return rows.map(fromDb);
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.bestseller, true))
    .orderBy(desc(productsTable.sortOrder))
    .limit(limit);
  return rows.map(fromDb);
}

export async function getProtectiveGowns(limit = 4): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isProtectiveGown, true))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title))
    .limit(limit);
  return rows.map(fromDb);
}

// ---- Admin (raw rows, full fields incl. images/flags) ----

export type ProductRow = DbProduct;

/** Full rows for the admin product list — every field, including flags. */
export async function getAllProductRows(): Promise<ProductRow[]> {
  return db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.title));
}

/** A single full row by id — backs the admin edit form. */
export async function getProductRowById(
  id: string,
): Promise<ProductRow | null> {
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  return row ?? null;
}
