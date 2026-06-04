import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  getInquiryStatusCounts,
  getRecentInquiries,
  getInquirySourceCounts,
} from "@/lib/inquiries";
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

  const [counts, recent, sources] = await Promise.all([
    getInquiryStatusCounts(),
    getRecentInquiries(6),
    getInquirySourceCounts(),
  ]);

  const sourceTotal = sources.reduce((sum, s) => sum + s.count, 0);

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

      {/* Lead sources */}
      <div className="mt-10">
        <h2 className="text-h4 font-semibold">Lead sources</h2>
        <div className="mt-4 rounded-xl border border-[var(--border-default)] bg-white p-6">
          {sources.length === 0 ? (
            <p className="text-body-sm text-[var(--fg-muted)]">
              No inquiries yet — sources will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {sources.map((s) => {
                const pct = sourceTotal
                  ? Math.round((s.count / sourceTotal) * 100)
                  : 0;
                return (
                  <li key={s.source}>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-medium">
                        {SOURCE_LABELS[s.source] ?? s.source}
                      </span>
                      <span className="text-[var(--fg-muted)]">
                        {s.count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--bg-surface-muted)]">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  "home-hero": "Home hero",
  "contact-page": "Contact page",
  "product-page": "Product page",
  "whatsapp-fallback": "WhatsApp fallback",
  unknown: "Unknown",
};

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
