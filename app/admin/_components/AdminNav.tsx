"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

const LINKS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/products", label: "Products" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "rounded-md px-3 py-1.5 text-body-sm font-semibold transition-colors",
              active
                ? "bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg-primary)]",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
