import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getInquiries, getInquiryStatusCounts } from "@/lib/inquiries";
import {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABELS,
  type InquiryStatus,
} from "@/lib/inquiry-status";
import { formatDateTime } from "@/lib/format";
import { clsx } from "@/lib/clsx";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";

export const metadata = {
  title: "Inquiries — Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

function isStatus(v: string | undefined): v is InquiryStatus {
  return !!v && (INQUIRY_STATUSES as readonly string[]).includes(v);
}

export default async function InquiriesPage({ searchParams }: PageProps) {
  await requireAdmin();

  const { status } = await searchParams;
  const activeStatus = isStatus(status) ? status : undefined;

  const [rows, counts] = await Promise.all([
    getInquiries(activeStatus ? { status: activeStatus } : undefined),
    getInquiryStatusCounts(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Inquiries</h1>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            {counts.total} total ·{" "}
            {activeStatus
              ? `${INQUIRY_STATUS_LABELS[activeStatus]}: ${rows.length}`
              : "showing all"}
          </p>
        </div>
        <a
          href="/admin/inquiries/export"
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-white px-4 py-2 text-body-sm font-semibold hover:bg-[var(--bg-surface-muted)]"
        >
          <Download size={16} aria-hidden="true" />
          Export CSV
        </a>
      </div>

      {/* Status filter pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <FilterPill
          href="/admin/inquiries"
          active={!activeStatus}
          label="All"
          count={counts.total}
        />
        {INQUIRY_STATUSES.map((s) => (
          <FilterPill
            key={s}
            href={`/admin/inquiries?status=${s}`}
            active={activeStatus === s}
            label={INQUIRY_STATUS_LABELS[s]}
            count={counts[s]}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-body-sm text-[var(--fg-muted)]">
            No inquiries{activeStatus ? ` with status "${activeStatus}"` : ""} yet.
          </p>
        ) : (
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] text-caption uppercase tracking-wide text-[var(--fg-muted)]">
              <tr>
                <Th>Received</Th>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Product</Th>
                <Th>Status</Th>
                <Th className="text-right">{""}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--bg-surface-muted)]">
                  <Td className="whitespace-nowrap text-[var(--fg-muted)]">
                    {formatDateTime(r.createdAt)}
                  </Td>
                  <Td>
                    <span className="font-semibold">{r.name}</span>
                    <span className="block text-caption text-[var(--fg-muted)]">
                      {r.email}
                    </span>
                  </Td>
                  <Td>{r.company ?? "—"}</Td>
                  <Td>{r.productTitle ?? "—"}</Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td className="text-right">
                    <Link
                      href={`/admin/inquiries/${r.id}`}
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      View →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-body-sm font-semibold transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "border border-[var(--border-default)] bg-white text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)]",
      )}
    >
      {label}
      <span
        className={clsx(
          "rounded-full px-1.5 text-caption",
          active ? "bg-white/20" : "bg-[var(--bg-surface-muted)]",
        )}
      >
        {count}
      </span>
    </Link>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={clsx("px-4 py-3 font-semibold", className)}>{children}</th>;
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={clsx("px-4 py-3 align-top", className)}>{children}</td>;
}
