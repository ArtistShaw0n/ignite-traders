"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

const LINKS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/products", label: "Products" },
];

export function AdminNav({ newCount = 0 }: { newCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        const badge =
          l.href === "/admin/inquiries" && newCount > 0 ? newCount : null;

        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "relative rounded-md px-3 py-1.5 text-body-sm font-semibold transition-colors",
              active
                ? "bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg-primary)]",
            )}
          >
            {l.label}
            {badge !== null && (
              <span
                aria-label={`${badge} new ${badge === 1 ? "inquiry" : "inquiries"}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white"
              >
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
