import Link from "next/link";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

/**
 * Admin route group layout — adds ClerkProvider so client hooks
 * (UserButton, useUser) work in this subtree only. The marketing site
 * stays free of Clerk JS to keep that bundle lean.
 *
 * Phase 6 will extend this with a sidebar (Inquiries / Products / etc.)
 * once those routes exist. For now it's a thin top bar.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      signInForceRedirectUrl="/admin"
      signInFallbackRedirectUrl="/admin"
    >
      <div className="min-h-screen bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]">
        <header className="border-b border-[var(--border-default)] bg-white">
          <div className="container-site flex items-center justify-between py-3">
            <Link
              href="/admin"
              className="text-body-sm font-bold tracking-tight"
            >
              IGNITE Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-caption text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
              >
                View site →
              </Link>
              <UserButton
                appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              />
            </div>
          </div>
        </header>
        <main className="container-site py-8">{children}</main>
      </div>
    </ClerkProvider>
  );
}
