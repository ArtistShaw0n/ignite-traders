import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getInquiryStatusCounts, getRecentInquiries } from "@/lib/inquiries";
import {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABELS,
} from "@/lib/inquiry-status";
import { formatDateTime } from "@/lib/format";
import { clsx } from "@/lib/clsx";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const { email } = await requireAdmin();

  const [counts, recent] = await Promise.all([
    getInquiryStatusCounts(),
    getRecentInquiries(6),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-h1 font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-body text-[var(--fg-muted)]">
        Logged in as <span className="font-semibold">{email}</span>.
      </p>

      {/* Status breakdown */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Total"
          value={counts.total}
          href="/admin/inquiries"
          highlight
        />
        {INQUIRY_STATUSES.map((s) => (
          <StatCard
            key={s}
            label={INQUIRY_STATUS_LABELS[s]}
            value={counts[s]}
            href={`/admin/inquiries?status=${s}`}
          />
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-h4 font-semibold">Recent inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="text-body-sm font-semibold text-brand-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--border-default)] bg-white">
          {recent.length === 0 ? (
            <p className="p-6 text-body-sm text-[var(--fg-muted)]">
              No inquiries yet. They&apos;ll appear here as they come in.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border-default)]">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/inquiries/${r.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-[var(--bg-surface-muted)]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold">{r.name}</span>
                      <span className="ml-2 text-caption text-[var(--fg-muted)]">
                        {r.productTitle ?? r.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={r.status} />
                      <span className="whitespace-nowrap text-caption text-[var(--fg-muted)]">
                        {formatDateTime(r.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Coming next */}
      <div className="mt-10 rounded-xl border border-[var(--border-default)] bg-white p-6">
        <h2 className="text-h4 font-semibold">Coming next</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-body-sm text-[var(--fg-muted)]">
          <li>Phase 8 — Product CMS: edit titles, swap images, toggle featured / bestseller.</li>
          <li>Phase 9 — Live email delivery status (Resend webhook).</li>
          <li>Phase 10 — Analytics &amp; lead-source breakdown.</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "rounded-xl border p-4 transition-colors",
        highlight
          ? "border-brand-600 bg-brand-50 hover:bg-brand-100"
          : "border-[var(--border-default)] bg-white hover:bg-[var(--bg-surface-muted)]",
      )}
    >
      <p className="text-caption font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </p>
      <p className="mt-1 text-h3 font-bold tracking-tight">{value}</p>
    </Link>
  );
}
