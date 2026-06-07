import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCategories, getProductCountsByCategory } from "@/lib/categories";

export const metadata = {
  title: "Categories — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const [cats, counts] = await Promise.all([getCategories(), getProductCountsByCategory()]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            {cats.length} categories. Drive the product form, filters and nav.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-body-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} aria-hidden="true" />
          Add category
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        {cats.length === 0 ? (
          <p className="p-8 text-center text-body-sm text-[var(--fg-muted)]">
            No categories yet. Add your first one.
          </p>
        ) : (
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] text-caption uppercase tracking-wide text-[var(--fg-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Label</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Sort</th>
                <th className="px-4 py-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {cats.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--bg-surface-muted)]">
                  <td className="px-4 py-3 font-semibold">{c.label}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">/{c.slug}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{counts[c.slug] ?? 0}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
