import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllProductRows } from "@/lib/products";
import { clsx } from "@/lib/clsx";

export const metadata = {
  title: "Products — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const rows = await getAllProductRows();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            {rows.length} in the catalog. Edits go live immediately.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-body-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} aria-hidden="true" />
          Add product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-body-sm text-[var(--fg-muted)]">
            No products yet. Add your first one.
          </p>
        ) : (
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] text-caption uppercase tracking-wide text-[var(--fg-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Badge</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 font-semibold">Sort</th>
                <th className="px-4 py-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {rows.map((r) => {
                const badge = r.badge as { label: string } | null;
                return (
                  <tr key={r.id} className="hover:bg-[var(--bg-surface-muted)]">
                    <td className="px-4 py-3">
                      <span className="font-semibold">{r.title}</span>
                      <span className="block text-caption text-[var(--fg-muted)]">
                        /{r.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.categoryLabel}</td>
                    <td className="px-4 py-3">{badge?.label ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.featured && <Flag>Featured</Flag>}
                        {r.bestseller && <Flag>Bestseller</Flag>}
                        {r.isProtectiveGown && <Flag>Gown</Flag>}
                        {!r.featured && !r.bestseller && !r.isProtectiveGown && (
                          <span className="text-[var(--fg-muted)]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">
                      {r.sortOrder}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${r.id}/edit`}
                        className="font-semibold text-brand-600 hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Flag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded px-1.5 py-0.5 text-caption font-semibold",
        "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20",
      )}
    >
      {children}
    </span>
  );
}
