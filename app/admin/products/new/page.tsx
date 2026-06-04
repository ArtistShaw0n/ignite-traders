import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createProduct } from "@/app/actions/admin-products";
import { ProductForm } from "@/app/admin/_components/ProductForm";

export const metadata = {
  title: "New product — Admin",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <h1 className="mt-4 text-h2 font-bold tracking-tight">New product</h1>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
        It will appear on the live site as soon as you save.
      </p>

      <div className="mt-8">
        <ProductForm action={createProduct} submitLabel="Create product" />
      </div>
    </div>
  );
}
