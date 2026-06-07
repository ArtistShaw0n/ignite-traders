import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";
import { AdminNav } from "@/app/admin/_components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Signed out (e.g. the sign-in page) — render bare, without admin chrome.
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]">
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>
      <header className="border-b border-[var(--border-default)] bg-white">
        <div className="container-site flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-body-sm font-bold tracking-tight">
              IGNITE Admin
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-caption text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
            >
              View site →
            </Link>
            <span className="hidden text-caption text-[var(--fg-muted)] sm:inline">
              {session.user.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-[var(--border-default)] px-3 py-1.5 text-body-sm font-semibold hover:bg-[var(--bg-surface-muted)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="admin-main" className="container-site py-8">
        {children}
      </main>
    </div>
  );
}
