"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { parseProductForm } from "@/lib/validation/product";

export type ProductActionResult =
  | { ok: true; id: string; slug: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Marketing product pages are statically generated from the DB
 * (generateStaticParams), so a CMS edit must explicitly revalidate them.
 */
function revalidateProductSurfaces(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(
  _prev: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  const d = parsed.data;

  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, d.slug))
    .limit(1);
  if (existing) {
    return {
      ok: false,
      error: "That slug is already in use.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  try {
    const [row] = await db
      .insert(products)
      .values({
        slug: d.slug,
        title: d.title,
        categorySlug: d.categorySlug,
        categoryLabel: d.categoryLabel,
        description: d.description,
        sizes: d.sizes,
        badge: d.badge,
        images: d.images,
        sku: d.sku,
        material: d.material,
        usageArea: d.usageArea,
        bulkSupply: d.bulkSupply,
        featured: d.featured,
        bestseller: d.bestseller,
        isProtectiveGown: d.isProtectiveGown,
        sortOrder: d.sortOrder,
      })
      .returning({ slug: products.slug });

    revalidateProductSurfaces(row.slug);
  } catch (err) {
    console.error("createProduct failed", err);
    return { ok: false, error: "Could not create the product. Please retry." };
  }

  // Outside the try so the redirect's control-flow signal isn't swallowed.
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  const d = parsed.data;

  const [clash] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, d.slug), ne(products.id, id)))
    .limit(1);
  if (clash) {
    return {
      ok: false,
      error: "That slug is already in use by another product.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  try {
    const [old] = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    await db
      .update(products)
      .set({
        slug: d.slug,
        title: d.title,
        categorySlug: d.categorySlug,
        categoryLabel: d.categoryLabel,
        description: d.description,
        sizes: d.sizes,
        badge: d.badge,
        images: d.images,
        sku: d.sku,
        material: d.material,
        usageArea: d.usageArea,
        bulkSupply: d.bulkSupply,
        featured: d.featured,
        bestseller: d.bestseller,
        isProtectiveGown: d.isProtectiveGown,
        sortOrder: d.sortOrder,
        updatedAt: sql`now()`,
      })
      .where(eq(products.id, id));

    revalidateProductSurfaces(d.slug);
    // If the slug changed, the old URL needs revalidating too.
    if (old && old.slug !== d.slug) revalidatePath(`/products/${old.slug}`);
  } catch (err) {
    console.error("updateProduct failed", err);
    return { ok: false, error: "Could not update the product. Please retry." };
  }

  redirect("/admin/products");
}

export async function deleteProduct(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  try {
    const [old] = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    // inquiries.productId is ON DELETE SET NULL, so related inquiries
    // survive with a null product link — no FK violation.
    await db.delete(products).where(eq(products.id, id));

    revalidateProductSurfaces(old?.slug);
    return { ok: true };
  } catch (err) {
    console.error("deleteProduct failed", err);
    return { ok: false, error: "Could not delete the product." };
  }
}
