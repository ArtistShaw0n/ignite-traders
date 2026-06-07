import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getProductRowById } from "@/lib/products";
import { getCategoryOptions } from "@/lib/categories";
import { updateProduct } from "@/app/actions/admin-products";
import { ProductForm } from "@/app/admin/_components/ProductForm";
import { DeleteProductButton } from "@/app/admin/_components/DeleteProductButton";
import type { ProductImage } from "@/lib/validation/product";

export const metadata = {
  title: "Edit product — Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const row = await getProductRowById(id);
  if (!row) notFound();

  const categories = await getCategoryOptions();
  const badge = row.badge as { color: string; label: string } | null;
  const action = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h2 font-bold tracking-tight">Edit product</h1>
        <DeleteProductButton id={id} title={row.title} />
      </div>

      <div className="mt-8">
        <ProductForm
          action={action}
          submitLabel="Save changes"
          categories={categories}
          initial={{
            slug: row.slug,
            title: row.title,
            categorySlug: row.categorySlug,
            description: row.description,
            sizes: row.sizes.join(", "),
            sku: row.sku,
            material: row.material,
            usageArea: row.usageArea,
            bulkSupply: row.bulkSupply,
            badgeColor: badge?.color ?? "",
            featured: row.featured,
            bestseller: row.bestseller,
            isProtectiveGown: row.isProtectiveGown,
            sortOrder: row.sortOrder,
            images: (row.images as ProductImage[]) ?? [],
          }}
        />
      </div>
    </div>
  );
}
