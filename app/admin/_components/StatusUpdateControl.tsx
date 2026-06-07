"use client";

import { useState, useTransition } from "react";
import { Dropdown } from "@/components/atoms";
import { updateInquiryStatus } from "@/app/actions/admin-inquiries";
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABELS, type InquiryStatus } from "@/lib/inquiry-status";

/**
 * Client control that flips an inquiry's pipeline status via the
 * updateInquiryStatus server action. Optimistic — the dropdown updates
 * immediately and rolls back if the action reports a failure.
 */
export function StatusUpdateControl({ id, current }: { id: string; current: InquiryStatus }) {
  const [status, setStatus] = useState<InquiryStatus>(current);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options = INQUIRY_STATUSES.map((s) => ({
    value: s,
    label: INQUIRY_STATUS_LABELS[s],
  }));

  function handleChange(value: string) {
    const next = value as InquiryStatus;
    const prev = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const res = await updateInquiryStatus(id, next);
      if (!res.ok) {
        setStatus(prev);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Dropdown label="Status" options={options} value={status} onChange={handleChange} />
      {pending && <span className="text-caption text-[var(--fg-muted)]">Saving…</span>}
      {error && <span className="text-caption text-red-600">{error}</span>}
    </div>
  );
}
