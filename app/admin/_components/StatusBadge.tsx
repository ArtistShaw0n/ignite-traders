import { clsx } from "@/lib/clsx";
import {
  INQUIRY_STATUS_CLASSES,
  INQUIRY_STATUS_LABELS,
  type InquiryStatus,
} from "@/lib/inquiry-status";

export function StatusBadge({ status, className }: { status: InquiryStatus; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold ring-1 ring-inset",
        INQUIRY_STATUS_CLASSES[status],
        className,
      )}
    >
      {INQUIRY_STATUS_LABELS[status]}
    </span>
  );
}
