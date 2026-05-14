import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { clsx } from "@/lib/clsx";

export interface FooterProps {
  className?: string;
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Request a Quote", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
];

const CATEGORIES = [
  { label: "Protective Gown", href: "/products?category=protective-gown" },
  { label: "Head Cover", href: "/products?category=head-cover" },
  { label: "Shoe Cover", href: "/products?category=shoe-cover" },
  { label: "Gloves", href: "/products?category=gloves" },
  { label: "Safety Shoes", href: "/products?category=safety-shoes" },
  { label: "Goggles", href: "/products?category=goggles" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={clsx(
        // Subtle top border separates Footer visually when the preceding section
        // is also dark (e.g. RequestQuoteCTA) — prevents the two from blending.
        "bg-ink-900 text-white border-t border-white/10",
        className,
      )}
    >
      <div className="container-site section-pad-sm">
        <div className="grid gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-body-sm text-white/70 leading-relaxed max-w-[260px]">
              Protective Wear & Safety Supply for Pharmaceutical Production
              Units.
            </p>
            <a
              href="tel:01798214677"
              className="inline-flex items-center gap-2 text-body-sm text-white/90 hover:text-brand-400 transition-colors"
            >
              <PhoneIcon />
              01798214677
            </a>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            {QUICK_LINKS.map((l) => (
              <FooterLink key={l.href + l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Categories */}
          <FooterColumn title="Categories">
            {CATEGORIES.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Get In Touch */}
          <FooterColumn title="Get In Touch">
            <p className="text-body-sm text-white/70 leading-relaxed">
              6/1 South Kallyanpur,
              <br />
              Mirpur Road, Dhaka
            </p>
            <a
              href="tel:01798214677"
              className="block text-body-sm text-white/70 hover:text-brand-400 transition-colors"
            >
              01798214677
            </a>
            <a
              href="mailto:tarif@ignitetradesbd.com"
              className="block text-body-sm text-white/70 hover:text-brand-400 transition-colors break-all"
            >
              tarif@ignitetradesbd.com
            </a>
            <p className="text-body-sm text-white/70">
              WhatsApp:{" "}
              <a
                href="https://wa.me/8801798214677"
                className="hover:text-brand-400 transition-colors"
              >
                01798214677
              </a>
            </p>
          </FooterColumn>
        </div>

        {/* Copyright bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-body-sm text-white/60">
            © 2026 Ignite Traders. All rights reserved.
          </p>
          <p className="text-body-sm text-white/60">Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-caption font-bold uppercase tracking-wider text-brand-400 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {Array.isArray(children)
          ? children.map((c, i) => <li key={i}>{c}</li>)
          : children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-body-sm text-white/70 hover:text-brand-400 transition-colors"
    >
      {children}
    </Link>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.36 1.78.7 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.27a2 2 0 0 1 2.11-.45c.83.34 1.7.58 2.6.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
