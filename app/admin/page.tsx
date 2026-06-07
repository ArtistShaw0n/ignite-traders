import Link from "next/link";
import { FolderTree, Package, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllProductRows } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { listAdmins } from "@/lib/admins";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const { email } = await requireAdmin();
  const [products, cats, admins] = await Promise.all([
    getAllProductRows(),
    getCategories(),
    listAdmins(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-h1 font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-body text-[var(--fg-muted)]">
        Logged in as <span className="font-semibold">{email}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <NavCard
          href="/admin/products"
          icon={<Package size={22} aria-hidden="true" />}
          title="Products"
          desc={`${products.length} in the catalog`}
        />
        <NavCard
          href="/admin/categories"
          icon={<FolderTree size={22} aria-hidden="true" />}
          title="Categories"
          desc={`${cats.length} categories`}
        />
        <NavCard
          href="/admin/admins"
          icon={<Users size={22} aria-hidden="true" />}
          title="Admins"
          desc={`${admins.length} with access`}
        />
      </div>
    </div>
  );
}

function NavCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--border-default)] bg-white p-5 transition-colors hover:bg-[var(--bg-surface-muted)]"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        {icon}
      </span>
      <p className="mt-3 text-h4 font-semibold">{title}</p>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">{desc}</p>
    </Link>
  );
}
