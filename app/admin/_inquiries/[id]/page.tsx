import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getInquiryById, getEmailLogForInquiry } from "@/lib/inquiries";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import { StatusUpdateControl } from "@/app/admin/_components/StatusUpdateControl";

export const metadata = {
  title: "Inquiry — Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  const logs = await getEmailLogForInquiry(id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-1.5 text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to inquiries
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-h2 font-bold tracking-tight">{inquiry.name}</h1>
            <StatusBadge status={inquiry.status} />
          </div>
          <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
            Received {formatDateTime(inquiry.createdAt)}
            {inquiry.source ? ` · via ${inquiry.source}` : ""}
          </p>
        </div>
        <StatusUpdateControl id={inquiry.id} current={inquiry.status} />
      </div>

      {/* Contact + request details */}
      <dl className="mt-8 grid gap-x-8 gap-y-5 rounded-xl border border-[var(--border-default)] bg-white p-6 sm:grid-cols-2">
        <Field label="Email">
          <a href={`mailto:${inquiry.email}`} className="text-brand-600 hover:underline">
            {inquiry.email}
          </a>
        </Field>
        <Field label="Phone">
          {inquiry.phone ? (
            <a href={`tel:${inquiry.phone}`} className="text-brand-600 hover:underline">
              {inquiry.phone}
            </a>
          ) : (
            "—"
          )}
        </Field>
        <Field label="Company">{inquiry.company ?? "—"}</Field>
        <Field label="Product">
          {inquiry.productTitle ? (
            inquiry.productSlug ? (
              <Link
                href={`/products/${inquiry.productSlug}`}
                className="text-brand-600 hover:underline"
              >
                {inquiry.productTitle}
              </Link>
            ) : (
              inquiry.productTitle
            )
          ) : (
            "—"
          )}
        </Field>
        <Field label="Quantity">{inquiry.quantity ?? "—"}</Field>
        <Field label="Last updated">{formatDateTime(inquiry.updatedAt)}</Field>
      </dl>

      {/* Message */}
      <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-white p-6">
        <h2 className="text-caption font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
          Message
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-body leading-relaxed">{inquiry.message}</p>
      </div>

      {/* Email log */}
      <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-white p-6">
        <h2 className="text-caption font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
          Email log
        </h2>
        {logs.length === 0 ? (
          <p className="mt-3 text-body-sm text-[var(--fg-muted)]">
            No emails recorded for this inquiry.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border-default)]">
            {logs.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 text-body-sm"
              >
                <span className="font-medium">{l.template}</span>
                <span className="text-[var(--fg-muted)]">{l.toEmail}</span>
                <span
                  className={
                    l.status === "failed" || l.status === "bounced"
                      ? "font-semibold text-red-600"
                      : "font-semibold text-emerald-700"
                  }
                >
                  {l.status}
                </span>
                <span className="text-caption text-[var(--fg-muted)]">
                  {formatDateTime(l.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-caption font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-body">{children}</dd>
    </div>
  );
}
