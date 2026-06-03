import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { db } from "./client";
import { products } from "./schema";
import productsJson from "../data/products.json";

interface JsonProduct {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  sizes: string;
  badge?: { color: "bestseller" | "bulk" | "new"; label: string };
  description: string;
  sku: string;
  material: string;
  usageArea: string;
  bulkSupply: string;
}

/**
 * Idempotent seed — re-running it updates existing rows in place
 * (matched on `slug`) and inserts any new ones. UUIDs are stable across
 * re-runs because conflicts update instead of insert.
 */
async function main() {
  const raw = productsJson as JsonProduct[];
  console.log(`Seeding ${raw.length} products…`);

  for (const [index, p] of raw.entries()) {
    const sizes = p.sizes
      .split(/[,/]/) // some entries use "S, M, L"; "S–XXL" stays as one
      .map((s) => s.trim())
      .filter(Boolean);

    await db
      .insert(products)
      .values({
        slug: p.slug,
        title: p.title,
        categoryLabel: p.categoryLabel,
        categorySlug: p.category,
        description: p.description,
        sizes,
        badge: p.badge ?? null,
        sku: p.sku,
        material: p.material,
        usageArea: p.usageArea,
        bulkSupply: p.bulkSupply,
        featured: !!p.badge,
        bestseller: p.badge?.color === "bestseller",
        isProtectiveGown: p.category === "protective-gown",
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          title: p.title,
          categoryLabel: p.categoryLabel,
          categorySlug: p.category,
          description: p.description,
          sizes,
          badge: p.badge ?? null,
          sku: p.sku,
          material: p.material,
          usageArea: p.usageArea,
          bulkSupply: p.bulkSupply,
          featured: !!p.badge,
          bestseller: p.badge?.color === "bestseller",
          isProtectiveGown: p.category === "protective-gown",
          sortOrder: index,
          updatedAt: sql`now()`,
        },
      });
    console.log(`  ✓ ${p.slug}`);
  }

  console.log(`\nSeed complete. ${raw.length} products written.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
