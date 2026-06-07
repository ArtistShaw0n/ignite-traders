/**
 * Client-safe inquiry-status constants. Kept separate from
 * `lib/inquiries.ts` (which is `server-only` because it touches the DB)
 * so client components — e.g. the status-update dropdown — can import the
 * list, labels, and type without pulling the server bundle.
 */
export const INQUIRY_STATUSES = ["new", "replied", "quoted", "won", "lost"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  replied: "Replied",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

/** Tailwind class pairs for each status pill (light-mode admin UI). */
export const INQUIRY_STATUS_CLASSES: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-800 ring-blue-600/20",
  replied: "bg-amber-100 text-amber-800 ring-amber-600/20",
  quoted: "bg-violet-100 text-violet-800 ring-violet-600/20",
  won: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  lost: "bg-zinc-200 text-zinc-700 ring-zinc-500/20",
};
