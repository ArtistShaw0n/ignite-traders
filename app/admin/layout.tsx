import Link from "next/link";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { AdminNav } from "@/app/admin/_components/AdminNav";
import { getAdminUser } from "@/lib/auth";
import { getInquiryStatusCounts } from "@/lib/inquiries";

/**
 * Admin layout — adds ClerkProvider so client hooks (UserButton, useUser)
 * work in this subtree only, keeping Clerk JS out of the marketing bundle.
 *
 * Also fetches the count of `new` inquiries (only for a signed-in admin) so
 * the nav can show a notification badge. Cheap COUNT query; runs per admin
 * page load, and the status-update action revalidates these paths so the
 * badge stays current.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  let newCount = 0;
  if (admin) {
    const counts = await getInquiryStatusCounts();
    newCount = counts.new;
  }

  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      signInForceRedirectUrl="/admin"
      signInFallbackRedirectUrl="/admin"
    >
      <div className="min-h-screen bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]">
        <header className="border-b border-[var(--border-default)] bg-white">
          <div className="container-site flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-body-sm font-bold tracking-tight"
              >
                IGNITE Admin
              </Link>
              <AdminNav newCount={newCount} />
            </div>
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
