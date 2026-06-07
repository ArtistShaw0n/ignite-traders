"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export type CategoryActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ParsedCategory =
  | { ok: true; data: { label: string; slug: string; sortOrder: number } }
  | { ok: false; fieldErrors: Record<string, string[]> };

function parseCategoryForm(formData: FormData): ParsedCategory {
  const label = String(formData.get("label") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();

  const fieldErrors: Record<string, string[]> = {};
  if (!label) fieldErrors.label = ["Label is required"];
  if (!slug) fieldErrors.slug = ["Slug is required"];
  else if (!SLUG_RE.test(slug))
    fieldErrors.slug = ["Lowercase letters, numbers and single hyphens only"];

  const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 0;
  if (!Number.isFinite(sortOrder) || sortOrder < 0)
    fieldErrors.sortOrder = ["Must be a non-negative number"];

  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };
  return { ok: true, data: { label, slug, sortOrder: Math.trunc(sortOrder) } };
}

/** Categories show up on the home filter, /products filter and nav menus. */
function revalidateCategorySurfaces() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function createCategory(
  _prev: CategoryActionResult | null,
  formData: FormData,
): Promise<CategoryActionResult> {
  await requireAdmin();

  const parsed = parseCategoryForm(formData);
  if (!parsed.ok)
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, parsed.data.slug))
    .limit(1);
  if (existing)
    return {
      ok: false,
      error: "That slug is already in use.",
      fieldErrors: { slug: ["Slug already in use"] },
    };

  try {
    await db.insert(categories).values(parsed.data);
    revalidateCategorySurfaces();
  } catch (err) {
    console.error("createCategory failed", err);
    return { ok: false, error: "Could not create the category. Please retry." };
  }

  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prev: CategoryActionResult | null,
  formData: FormData,
): Promise<CategoryActionResult> {
  await requireAdmin();

  const parsed = parseCategoryForm(formData);
  if (!parsed.ok)
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };

  const [clash] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.slug, parsed.data.slug), ne(categories.id, id)))
    .limit(1);
  if (clash)
    return {
      ok: false,
      error: "That slug is already in use.",
      fieldErrors: { slug: ["Slug already in use"] },
    };

  try {
    const [old] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);

    await db
      .update(categories)
      .set({
        label: parsed.data.label,
        slug: parsed.data.slug,
        sortOrder: parsed.data.sortOrder,
        updatedAt: sql`now()`,
      })
      .where(eq(categories.id, id));

    // Keep products' denormalised category fields in sync on rename.
    if (old && (old.slug !== parsed.data.slug || old.label !== parsed.data.label)) {
      await db
        .update(products)
        .set({
          categorySlug: parsed.data.slug,
          categoryLabel: parsed.data.label,
          updatedAt: sql`now()`,
        })
        .where(eq(products.categorySlug, old.slug));
    }

    revalidateCategorySurfaces();
  } catch (err) {
    console.error("updateCategory failed", err);
    return { ok: false, error: "Could not update the category. Please retry." };
  }

  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  try {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!cat) return { ok: false, error: "Category not found." };

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.categorySlug, cat.slug));

    if (count > 0)
      return {
        ok: false,
        error: `${count} product(s) use this category. Reassign them first.`,
      };

    await db.delete(categories).where(eq(categories.id, id));
    revalidateCategorySurfaces();
    return { ok: true };
  } catch (err) {
    console.error("deleteCategory failed", err);
    return { ok: false, error: "Could not delete the category." };
  }
}
