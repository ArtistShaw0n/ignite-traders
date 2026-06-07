import { z } from "zod";

/**
 * Validation + parsing for the admin Product CMS form.
 *
 * The form posts FormData; `parseProductForm` validates the text fields
 * with zod and assembles the rest (category label, sizes array, badge
 * object, boolean flags, images) into a DB-ready shape.
 */

export const BADGE_COLORS = ["bestseller", "bulk", "new"] as const;
export type BadgeColor = (typeof BADGE_COLORS)[number];

const BADGE_LABELS: Record<BadgeColor, string> = {
  bestseller: "Bestseller",
  bulk: "Bulk",
  new: "New",
};

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductFormData {
  slug: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  description: string;
  sizes: string[];
  badge: { color: BadgeColor; label: string } | null;
  sku: string;
  material: string;
  usageArea: string;
  bulkSupply: string;
  featured: boolean;
  bestseller: boolean;
  isProtectiveGown: boolean;
  sortOrder: number;
  images: ProductImage[];
}

const baseSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and single hyphens only"),
  categorySlug: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().min(1, "Description is required").max(2000),
  sku: z.string().trim().min(1, "SKU is required").max(100),
  material: z.string().trim().min(1, "Material is required").max(200),
  usageArea: z.string().trim().min(1, "Usage area is required").max(300),
  bulkSupply: z.string().trim().min(1, "Bulk supply is required").max(200),
  sizes: z.string().trim().max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  badgeColor: z.string().optional(),
  images: z.string().optional(),
});

export type ParseResult =
  | { success: true; data: ProductFormData }
  | { success: false; fieldErrors: Record<string, string[] | undefined> };

export function parseProductForm(
  formData: FormData,
  categories: { slug: string; label: string }[],
): ParseResult {
  const raw = Object.fromEntries(formData.entries());
  const parsed = baseSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const category = categories.find((c) => c.slug === parsed.data.categorySlug);
  if (!category) {
    return { success: false, fieldErrors: { categorySlug: ["Invalid category"] } };
  }

  const sizes = (parsed.data.sizes ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const bc = parsed.data.badgeColor;
  const badge =
    bc && (BADGE_COLORS as readonly string[]).includes(bc)
      ? { color: bc as BadgeColor, label: BADGE_LABELS[bc as BadgeColor] }
      : null;

  let images: ProductImage[] = [];
  if (parsed.data.images) {
    try {
      const arr = JSON.parse(parsed.data.images);
      if (Array.isArray(arr)) {
        images = arr
          .filter((x) => x && typeof x.url === "string")
          .map((x) => ({
            url: x.url as string,
            alt: typeof x.alt === "string" ? x.alt : undefined,
          }));
      }
    } catch {
      // Malformed images payload — treat as none rather than failing.
    }
  }

  return {
    success: true,
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      categorySlug: category.slug,
      categoryLabel: category.label,
      description: parsed.data.description,
      sizes,
      badge,
      sku: parsed.data.sku,
      material: parsed.data.material,
      usageArea: parsed.data.usageArea,
      bulkSupply: parsed.data.bulkSupply,
      featured: formData.get("featured") != null,
      bestseller: formData.get("bestseller") != null,
      isProtectiveGown: formData.get("isProtectiveGown") != null,
      sortOrder: parsed.data.sortOrder ?? 0,
      images,
    },
  };
}
