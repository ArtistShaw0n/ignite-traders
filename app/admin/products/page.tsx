import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllProductRows, type ProductRow } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { clsx } from "@/lib/clsx";

export const metadata = {
  title: "Products — Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

/** Build a /admin/products URL that preserves whichever filters are active. */
function productsHref(opts: { category?: string; q?: string }): string {
  const sp = new URLSearchParams();
  if (opts.category) sp.set("category", opts.category);
  if (opts.q) sp.set("q", opts.q);
  const s = sp.toString();
  return s ? `/admin/products?${s}` : "/admin/products";
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requireAdmin();

  const { category, q } = await searchParams;
  const rawQuery = (q ?? "").trim();
  const query = rawQuery.toLowerCase();

  const [allRows, cats] = await Promise.all([getAllProductRows(), getCategories()]);

  // Text search across name / slug / SKU. Applied first so the category
  // pill counts reflect what the current search would actually return.
  const matchesQuery = (r: ProductRow) =>
    !query ||
    r.title.toLowerCase().includes(query) ||
    r.slug.toLowerCase().includes(query) ||
    r.sku.toLowerCase().includes(query);

  const searchFiltered = allRows.filter(matchesQuery);

  // Faceted counts: how many products each category has within the current
  // search. Drives the number shown on each pill.
  const countByCategory = new Map<string, number>();
  for (const r of searchFiltered) {
    countByCategory.set(r.categorySlug, (countByCategory.get(r.categorySlug) ?? 0) + 1);
  }

  const activeCategory =
    category && category !== "all" && cats.some((c) => c.slug === category) ? category : undefined;

  const rows = activeCategory
    ? searchFiltered.filter((r) => r.categorySlug === activeCategory)
    : searchFiltered;

  const isFiltering = !!activeCategory || !!query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            {allRows.length} in the catalog. Edits go live immediately.
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

      {/* Category filter pills — counts reflect the active search. */}
      <div className="mt-6 flex flex-wrap gap-2">
        <CategoryPill
          href={productsHref({ q: rawQuery || undefined })}
          active={!activeCategory}
          label="All"
          count={searchFiltered.length}
        />
        {cats.map((c) => (
          <CategoryPill
            key={c.slug}
            href={productsHref({ category: c.slug, q: rawQuery || undefined })}
            active={activeCategory === c.slug}
            label={c.label}
            count={countByCategory.get(c.slug) ?? 0}
          />
        ))}
      </div>

      {/* Search by name / slug / SKU. Plain GET form — works without JS. */}
      <form method="get" className="mt-4 flex flex-wrap items-center gap-2">
        {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
          />
          <input
            type="search"
            name="q"
            defaultValue={rawQuery}
            placeholder="Search name, slug or SKU…"
            aria-label="Search products"
            className="w-72 max-w-full rounded-md border border-[var(--border-default)] bg-white py-2 pl-9 pr-3 text-body-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border border-[var(--border-default)] bg-white px-4 py-2 text-body-sm font-semibold hover:bg-[var(--bg-surface-muted)]"
        >
          Search
        </button>
        {isFiltering && (
          <>
            <Link
              href="/admin/products"
              className="text-body-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
            >
              Clear
            </Link>
            <span className="text-caption text-[var(--fg-muted)] sm:ml-auto">
              Showing {rows.length} of {allRows.length}
            </span>
          </>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-body-sm text-[var(--fg-muted)]">
            {allRows.length === 0
              ? "No products yet. Add your first one."
              : "No products match your filter. Try another category or search term."}
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
                      <span className="block text-caption text-[var(--fg-muted)]">/{r.slug}</span>
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
                    <td className="px-4 py-3 text-[var(--fg-muted)]">{r.sortOrder}</td>
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

function CategoryPill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-body-sm font-semibold transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "border border-[var(--border-default)] bg-white text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)]",
      )}
    >
      {label}
      <span
        className={clsx(
          "rounded-full px-1.5 text-caption",
          active ? "bg-white/20" : "bg-[var(--bg-surface-muted)]",
        )}
      >
        {count}
      </span>
    </Link>
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
