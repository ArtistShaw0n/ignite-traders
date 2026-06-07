import "server-only";

import { cache } from "react";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { categories, products } from "@/db/schema";
import type { Category } from "@/db/schema";

export type { Category } from "@/db/schema";

/** Lightweight shape passed to client components (form/filter/nav). */
export interface CategoryOption {
  slug: string;
  label: string;
}

/** All categories, ordered. Memoised per request so layout + page share one query. */
export const getCategories = cache(async (): Promise<Category[]> => {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.label));
});

/** Just {slug,label} — convenient for client component props. */
export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const rows = await getCategories();
  return rows.map((c) => ({ slug: c.slug, label: c.label }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}

/** Product count per category slug — drives the admin list + delete guard. */
export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      slug: products.categorySlug,
      count: sql<number>`count(*)::int`,
    })
    .from(products)
    .groupBy(products.categorySlug);

  const out: Record<string, number> = {};
  for (const r of rows) out[r.slug] = r.count;
  return out;
}
