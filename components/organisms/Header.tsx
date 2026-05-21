"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/atoms/Button";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { CallUsBlock } from "@/components/molecules/CallUsBlock";
import { clsx } from "@/lib/clsx";

export interface HeaderProps {
  phone?: string;
  whatsapp?: string;
  className?: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Protective Gown", href: "/products?category=protective-gown" },
      { label: "Head Cover", href: "/products?category=head-cover" },
      { label: "Shoe Cover", href: "/products?category=shoe-cover" },
      { label: "Gloves", href: "/products?category=gloves" },
      { label: "Safety Shoes", href: "/products?category=safety-shoes" },
      { label: "Goggles", href: "/products?category=goggles" },
    ],
  },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Design System", href: "/design-system" },
];

export function Header({
  phone = "01798214677",
  whatsapp = "8801798214677",
  className,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 w-full bg-[var(--bg-surface)] border-b border-[var(--border-default)]",
        className,
      )}
    >
      <div className="container-site flex items-center justify-between h-16 sm:h-20 gap-4">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </nav>

        {/* Right side — call + whatsapp (desktop) + menu button (mobile) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:block">
            <CallUsBlock phone={phone} />
          </div>
          <ThemeToggle />
          <Button
            href={`https://wa.me/${whatsapp}`}
            variant="whatsapp"
            size="md"
            className="hidden sm:inline-flex"
          >
            WhatsApp
          </Button>
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--border-default)] text-[var(--fg-primary)]"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <MobileDrawer
          onClose={() => setMobileOpen(false)}
          phone={phone}
          whatsapp={whatsapp}
          productsOpen={productsOpen}
          setProductsOpen={setProductsOpen}
        />
      )}
    </header>
  );
}

function NavItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  if (!link.children) {
    return (
      <Link
        href={link.href}
        className="px-3 py-2 rounded-md text-body-sm font-semibold text-[var(--fg-primary)] hover:text-brand-500 hover:bg-[var(--bg-surface-muted)] transition-colors"
      >
        {link.label}
      </Link>
    );
  }
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-body-sm font-semibold text-[var(--fg-primary)] hover:text-brand-500 hover:bg-[var(--bg-surface-muted)] transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {link.label}
        <ChevronDown
          size={14}
          className={clsx("transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-1 min-w-[220px] rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-card-hover py-1 z-50"
        >
          {link.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              role="menuitem"
              className="block px-4 py-2 text-body-sm text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)] hover:text-brand-500 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDrawer({
  onClose,
  phone,
  whatsapp,
  productsOpen,
  setProductsOpen,
}: {
  onClose: () => void;
  phone: string;
  whatsapp: string;
  productsOpen: boolean;
  setProductsOpen: (v: boolean) => void;
}) {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="ml-auto relative w-[85%] max-w-[360px] h-full bg-[var(--bg-surface)] shadow-card-hover flex flex-col">
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border-default)]">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-[var(--fg-primary)]"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV.map((link) =>
            link.children ? (
              <div key={link.href}>
                <button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-md text-body font-semibold text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)]"
                  aria-expanded={productsOpen}
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    className={clsx(
                      "transition-transform",
                      productsOpen && "rotate-180",
                    )}
                  />
                </button>
                {productsOpen && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {link.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={onClose}
                        className="block px-4 py-2 rounded-md text-body-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-surface-muted)] hover:text-brand-500"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block px-4 py-3 rounded-md text-body font-semibold text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="p-4 border-t border-[var(--border-default)] space-y-3">
          <CallUsBlock phone={phone} />
          <Button
            href={`https://wa.me/${whatsapp}`}
            variant="whatsapp"
            size="md"
            fullWidth
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
