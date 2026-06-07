import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createCategory } from "@/app/actions/admin-categories";
import { CategoryForm } from "@/app/admin/_components/CategoryForm";

export const metadata = {
  title: "New category — Admin",
  robots: { index: false, follow: false },
};

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to categories
      </Link>

      <h1 className="mt-4 text-h2 font-bold tracking-tight">New category</h1>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
        It becomes available in the product form and filters immediately.
      </p>

      <div className="mt-8">
        <CategoryForm action={createCategory} submitLabel="Create category" />
      </div>
    </div>
  );
}
