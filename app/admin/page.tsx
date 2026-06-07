import Link from "next/link";
import { Package } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllProductRows } from "@/lib/products";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const { email } = await requireAdmin();
  const products = await getAllProductRows();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-h1 font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-body text-[var(--fg-muted)]">
        Logged in as <span className="font-semibold">{email}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-xl border border-[var(--border-default)] bg-white p-5 transition-colors hover:bg-[var(--bg-surface-muted)]"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
            <Package size={22} aria-hidden="true" />
          </span>
          <p className="mt-3 text-h4 font-semibold">Products</p>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            {products.length} in the catalog
          </p>
        </Link>
      </div>
    </div>
  );
}
