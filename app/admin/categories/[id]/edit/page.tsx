import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCategoryById } from "@/lib/categories";
import { updateCategory } from "@/app/actions/admin-categories";
import { CategoryForm } from "@/app/admin/_components/CategoryForm";
import { DeleteCategoryButton } from "@/app/admin/_components/DeleteCategoryButton";

export const metadata = {
  title: "Edit category — Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const cat = await getCategoryById(id);
  if (!cat) notFound();

  const action = updateCategory.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to categories
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h2 font-bold tracking-tight">Edit category</h1>
        <DeleteCategoryButton id={cat.id} label={cat.label} />
      </div>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
        Renaming also updates every product currently in this category.
      </p>

      <div className="mt-8">
        <CategoryForm
          action={action}
          submitLabel="Save changes"
          initial={{
            label: cat.label,
            slug: cat.slug,
            sortOrder: cat.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
