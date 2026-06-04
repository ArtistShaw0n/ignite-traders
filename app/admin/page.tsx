import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { count } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin dashboard landing — Phase 5 stub. Phase 6 replaces this with
 * the inquiries list. For now we just confirm the auth gate works and
 * show a quick count of total inquiries.
 */
export default async function AdminHomePage() {
  const { email } = await requireAdmin();

  const [{ value: totalInquiries }] = await db
    .select({ value: count() })
    .from(inquiries);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-h1 font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-body text-[var(--fg-muted)]">
        Logged in as <span className="font-semibold">{email}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total inquiries" value={totalInquiries} />
        <Stat label="Products" value="12" />
        <Stat label="Pending replies" value="—" />
      </div>

      <div className="mt-10 rounded-xl border border-[var(--border-default)] bg-white p-6">
        <h2 className="text-h4 font-semibold">Coming next</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-body-sm text-[var(--fg-muted)]">
          <li>Phase 6 — Inquiries list, filter by status, mark replied / quoted / won / lost, CSV export.</li>
          <li>Phase 8 — Product CMS: edit titles, swap images, toggle featured / bestseller.</li>
          <li>Phase 9 — Email delivery log (Resend webhook).</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-white p-5">
      <p className="text-caption font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </p>
      <p className="mt-2 text-h2 font-bold tracking-tight">{value}</p>
    </div>
  );
}
