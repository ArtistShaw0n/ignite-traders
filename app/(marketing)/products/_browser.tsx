"use client";

import { useMemo, useState } from "react";
import { FilterPill } from "@/components/atoms";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Pagination } from "@/components/molecules/Pagination";
import {
  BulkQuoteCTA,
  PageHeader,
  ResultsBar,
} from "@/components/organisms";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import type { Product } from "@/lib/products";

const PER_PAGE = 8;

type SortValue = "popular" | "newest" | "name-asc";

const SORT_OPTIONS = [
  { label: "Most popular", value: "popular" },
  { label: "Newest first", value: "newest" },
  { label: "Name: A → Z", value: "name-asc" },
];

export function ProductsBrowser({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortValue>("popular");
  const [page, setPage] = useState<number>(1);

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "newest") return arr.reverse();
    if (sort === "name-asc")
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const paginated = sorted.slice(start, start + PER_PAGE);

  return (
    <>
      <PageHeader
        title="Browse our products"
        description="Industrial supplies, PPE, and clean-room essentials — sourced and stocked for fast dispatch. Filter by category or search for specific items. Bulk pricing available on all products."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {/* Filter pills */}
      <section className="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="container-site py-5">
          <div className="flex gap-2 flex-wrap">
            {PRODUCT_CATEGORIES.map((c) => (
              <FilterPill
                key={c.slug}
                active={c.slug === category}
                onClick={() => {
                  setCategory(c.slug);
                  setPage(1);
                }}
              >
                {c.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </section>

      {/* Results bar */}
      <section className="container-site">
        <ResultsBar
          shown={paginated.length}
          total={sorted.length}
          sortOptions={SORT_OPTIONS}
          sortValue={sort}
          onSortChange={(v) => {
            setSort(v as SortValue);
            setPage(1);
          }}
        />
      </section>

      {/* Product grid */}
      <section className="container-site pb-16">
        {paginated.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paginated.map((p) => (
              <ProductCard
                key={p.slug}
                title={p.title}
                category={p.categoryLabel}
                sizes={p.sizes}
                badge={p.badge}
                href={`/products/${p.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-body text-[var(--fg-muted)]">
              No products found in this category.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>

      <BulkQuoteCTA />
    </>
  );
}
