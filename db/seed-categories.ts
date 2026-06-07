import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { db } from "./client";
import { categories } from "./schema";

/**
 * Applies the `categories` table (migration 0002) + seeds the default set.
 *
 * drizzle-kit migrate hangs on Neon's serverless connection (see NOTES.md),
 * so we create the table via the neon-http driver directly. DDL is idempotent
 * (IF NOT EXISTS) and the seed upserts by slug, so this is safe to re-run.
 */
const SEED = [
  { slug: "protective-gown", label: "Protective Gown", sortOrder: 1 },
  { slug: "head-cover", label: "Head Cover", sortOrder: 2 },
  { slug: "shoe-cover", label: "Shoe Cover", sortOrder: 3 },
  { slug: "gloves", label: "Gloves", sortOrder: 4 },
  { slug: "safety-shoes", label: "Safety Shoes", sortOrder: 5 },
  { slug: "goggles", label: "Goggles", sortOrder: 6 },
  { slug: "other", label: "Other Protective Items", sortOrder: 7 },
];

async function main() {
  console.log("Ensuring categories table exists…");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" text NOT NULL,
      "label" text NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "categories_slug_unique" UNIQUE("slug")
    );
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "categories_sort_order_idx" ON "categories" USING btree ("sort_order");`,
  );

  console.log(`Seeding ${SEED.length} categories…`);
  for (const c of SEED) {
    await db
      .insert(categories)
      .values(c)
      .onConflictDoUpdate({
        target: categories.slug,
        set: { label: c.label, sortOrder: c.sortOrder, updatedAt: sql`now()` },
      });
    console.log(`  ✓ ${c.slug}`);
  }

  console.log("\nCategories ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
